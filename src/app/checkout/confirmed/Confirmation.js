// app/checkout/confirmed/Confirmation.js
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCheckout } from "@/app/lib/checkoutStore";

export default function Confirmation() {
  const orderId = useCheckout((s) => s.orderId);
  const reset = useCheckout((s) => s.reset);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  return (
    <>
      <h1 className="text-3xl font-bold">Order confirmed</h1>
      <p className="mt-4 text-gray-700">
        Your order <strong>{orderId}</strong> has been received. You will get a WhatsApp message shortly.
      </p>
      <div className="mt-8 space-y-3">
        <Link href="/products" className="block bg-brand text-white py-3 rounded">
          Keep shopping
        </Link>
        <button
          onClick={reset}
          className="block w-full text-sm text-gray-500"
        >
          Start a new order
        </button>
      </div>
    </>
  );
}