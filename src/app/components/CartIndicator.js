// app/components/CartIndicator.js
"use client";

import Link from "next/link";
import { useCart } from "@/app/lib/cartStore";
import { useEffect, useState } from "react";

export default function CartIndicator() {
  const totalItems = useCart((s) => s.totalItems());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <Link href="/cart" className="relative">
      Cart
      {hydrated && totalItems > 0 && (
        <span className="ml-2 bg-brand text-white text-xs rounded-full px-2 py-0.5">
          {totalItems}
        </span>
      )}
    </Link>
  );
}