// app/admin/orders/[id]/StatusUpdater.js
"use client";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/orders";

const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function StatusUpdater({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const next = TRANSITIONS[status];

  function handleChange(nextStatus) {
    setError("");
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(nextStatus);
      }
    });
  }

  if (next.length === 0) return <p className="text-sm text-gray-500">No further transitions.</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {next.map((s) => (
        <button
          key={s}
          onClick={() => handleChange(s)}
          disabled={isPending}
          className="px-4 py-2 bg-brand text-white rounded disabled:opacity-50"
        >
          Move to {s}
        </button>
      ))}
      {error && <p className="text-red-600 text-sm w-full">{error}</p>}
    </div>
  );
}