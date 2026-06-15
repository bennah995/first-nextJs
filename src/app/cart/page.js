// app/cart/page.js
import CartView from "./CartView";

export const metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <CartView />
    </div>
  );
}