// app/actions/createOrder.js
"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

function validatePhone(phone) {
  return /^\+?\d{9,14}$/.test(phone);
}

export async function createOrder(payload) {
  const { customer, items, paymentMethod } = payload;

  // Validation -- server side, never trust the client
  if (!customer?.name || customer.name.length < 2) {
    return { error: "Name is required" };
  }
  if (!validatePhone(customer.phone)) {
    return { error: "Phone number is invalid" };
  }
  if (!customer.address || customer.address.length < 5) {
    return { error: "Address is too short" };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Cart is empty" };
  }
  if (!["mpesa", "airtel", "cod"].includes(paymentMethod)) {
    return { error: "Invalid payment method" };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Fetch current prices and stock for every product in one query
    const ids = items.map((i) => i.id);
    const { rows: products } = await client.query(
      `SELECT id, price_cents, stock FROM products WHERE id = ANY($1) FOR UPDATE`,
      [ids]
    );

    if (products.length !== items.length) {
      await client.query("ROLLBACK");
      return { error: "Some products were not found" };
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    // 2. Check stock and compute subtotal from CURRENT server prices
    let subtotalCents = 0;
    for (const item of items) {
      const p = productMap[item.id];
      if (p.stock < item.quantity) {
        await client.query("ROLLBACK");
        return { error: `Out of stock: item ${item.id}` };
      }
      subtotalCents += p.price_cents * item.quantity;
    }

    // 3. Insert the order
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_name, customer_phone, delivery_address, subtotal_cents, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        customer.name,
        customer.phone,
        customer.address,
        subtotalCents,
        paymentMethod,
        paymentMethod === "cod" ? "pending" : "pending", // real payment moves to 'paid' via webhook in wk16
      ]
    );
    const orderId = orderRows[0].id;

    // 4. Insert order items
    for (const item of items) {
      const p = productMap[item.id];
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_cents_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, p.price_cents]
      );
    }

    // 5. Deduct stock
    for (const item of items) {
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.id]
      );
    }

    await client.query("COMMIT");

    // 6. Invalidate the catalogue cache so stock counts refresh
    revalidatePath("/products");
    revalidatePath(`/products/[slug]`, "page");

    return { orderId };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createOrder failed:", err);
    return { error: "Order failed. Please try again." };
  } finally {
    client.release();
  }
}