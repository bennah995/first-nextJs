// app/checkout/info/page.js
import InfoForm from "./InfoForm";

export const metadata = { title: "Checkout: Your Info" };

export default function CheckoutInfoPage() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Information</h1>
      <p className="text-sm text-gray-500 mb-4">Step 1 of 3</p>
      <InfoForm />
    </div>
  );
}