import { query } from "@/lib/db";
import { requireAdmin } from "@/app/actions/auth";
import StatusUpdater from "./StatusUpdater";
import { notFound } from "next/navigation";

export default async function AdminOrderDetail({ params }) {
  await requireAdmin();

  const { rows } = await query("SELECT * FROM orders WHERE id = $1", [params.id]);
  const order = rows[0];
  if (!order) notFound();

  const { rows: items } = await query(
    `SELECT oi.quantity, oi.price_cents_at_purchase, p.name, p.slug
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [params.id]
  );

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-1">Order {order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500 mb-6">{new Date(order.created_at).toLocaleString("en-KE")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium mb-2">Customer</h2>
          <p>{order.customer_name}</p>
          <p>{order.customer_phone}</p>
          <p className="text-sm text-gray-600">{order.delivery_address}</p>
        </div>
        <div>
          <h2 className="font-medium mb-2">Payment</h2>
          <p>Method: {order.payment_method}</p>
          <p>Total: KSh {(order.subtotal_cents / 100).toLocaleString()}</p>
          <p>Status: {order.status}</p>
        </div>
      </div>

      <h2 className="font-medium mt-8 mb-2">Items</h2>
      <ul className="border rounded divide-y">
        {items.map((item, i) => (
          <li key={i} className="p-3 flex justify-between">
            <span>{item.quantity} x {item.name}</span>
            <span>KSh {(item.price_cents_at_purchase * item.quantity / 100).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <StatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}