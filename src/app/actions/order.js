// app/actions/orders.js
"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";

const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(orderId, nextStatus) {
  await requireAdmin();

  const { rows } = await query("SELECT status FROM orders WHERE id = $1", [orderId]);
  const current = rows[0]?.status;
  if (!current) return { error: "Order not found" };

  if (!TRANSITIONS[current]?.includes(nextStatus)) {
    return { error: `Cannot transition from ${current} to ${nextStatus}` };
  }

  await query(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
    [nextStatus, orderId]
  );

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}