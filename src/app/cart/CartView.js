// app/cart/CartView.js
"use client";

import Link from "next/link";
import { useCart } from "@/app/lib/cartStore";
import { useCheckout } from "@/app/lib/checkoutStore";
import { useEffect, useState } from "react";

export default function CartView() {
  const items = useCart((s) => s.items);
  const totalCents = useCart((s) => s.totalCents());
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const goTo = useCheckout((s) => s.goTo);
  const STATES = useCheckout((s) => s.STATES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    goTo(STATES.CART);
  }, [hydrated, items.length, goTo, STATES]);

  if (!hydrated) return <p>Loading...</p>;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="bg-brand text-white px-6 py-3 rounded">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between border-b pb-4">
          <div>
            <Link href={`/products/${item.slug}`} className="font-medium">
              {item.name}
            </Link>
            <p className="text-sm text-gray-600">
              KSh {(item.price_cents / 100).toLocaleString()} each
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => setQuantity(item.id, parseInt(e.target.value, 10) || 0)}
              className="w-16 border p-1 text-center"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-4 text-xl font-bold">
        <span>Total</span>
        <span>KSh {(totalCents / 100).toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="block text-center bg-brand text-white py-3 rounded mt-6"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}