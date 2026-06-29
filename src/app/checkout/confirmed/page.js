// app/checkout/confirmed/page.js
import Confirmation from "./Confirmation";

export const metadata = { title: "Order Confirmed" };

export default function ConfirmedPage() {
  return (
    <div className="max-w-md mx-auto p-16 text-center">
      <Confirmation />
    </div>
  );
}