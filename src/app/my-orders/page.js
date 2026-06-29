import { query } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "My Orders" };

export default async function MyOrdersPage({ searchParams }) {
  const phone = searchParams.phone;
  let orders = [];
  if (phone) {
    const { rows } = await query(
      `SELECT id, subtotal_cents, status, created_at FROM orders
       WHERE customer_phone = $1 ORDER BY created_at DESC LIMIT 20`,
      [phone]
    );
    orders = rows;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <form action="/my-orders" method="GET" className="flex gap-2 mb-6">
        <input
          type="tel"
          name="phone"
          defaultValue={phone}
          placeholder="+254712..."
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-brand text-white px-4 rounded">Find</button>
      </form>

      {phone && orders.length === 0 && (
        <p className="text-gray-500">No orders found for {phone}.</p>
      )}

      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="border p-4 rounded">
            <div className="font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</div>
            <div className="flex justify-between mt-1">
              <span>KSh {(o.subtotal_cents / 100).toLocaleString()}</span>
              <span className="text-sm">{o.status}</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(o.created_at).toLocaleString("en-KE")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}