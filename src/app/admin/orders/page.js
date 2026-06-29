// app/admin/orders/page.js
import Link from "next/link";
import { query } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";

export const metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage({ searchParams }) {
  await requireAdmin();

  const {status = ""} = await searchParams || "";
  const params = [];
  let where = "";
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }

  const { rows: orders } = await query(
    `SELECT id, customer_name, customer_phone, subtotal_cents, payment_method, status, created_at
     FROM orders ${where}
     ORDER BY created_at DESC
     LIMIT 100`,
    params
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <nav className="flex gap-3 mb-6 text-sm">
        {["", "pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`px-3 py-1 rounded ${status === s ? "bg-brand text-white" : "bg-gray-100"}`}
          >
            {s || "all"}
          </Link>
        ))}
      </nav>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="p-2 border-b">Order</th>
            <th className="p-2 border-b">Customer</th>
            <th className="p-2 border-b">Total</th>
            <th className="p-2 border-b">Method</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">When</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="text-sm">
              <td className="p-2 border-b">
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs hover:underline">
                  {o.id.slice(0, 8)}
                </Link>
              </td>
              <td className="p-2 border-b">
                {o.customer_name}<br />
                <span className="text-xs text-gray-500">{o.customer_phone}</span>
              </td>
              <td className="p-2 border-b">KSh {(o.subtotal_cents / 100).toLocaleString()}</td>
              <td className="p-2 border-b">{o.payment_method}</td>
              <td className="p-2 border-b">
                <span className={`px-2 py-0.5 text-xs rounded ${statusColor(o.status)}`}>
                  {o.status}
                </span>
              </td>
              <td className="p-2 border-b text-xs text-gray-500">
                {new Date(o.created_at).toLocaleString("en-KE")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusColor(status) {
  return {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }[status] || "bg-gray-100";
}