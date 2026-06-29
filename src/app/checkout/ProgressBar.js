"use client";
import { useCheckout } from "@/app/lib/checkoutStore";

export default function ProgressBar() {
  const state = useCheckout((s) => s.state);
  const STATES = useCheckout((s) => s.STATES);
  const steps = [
    { key: STATES.CART, label: "Cart" },
    { key: STATES.INFO, label: "Info" },
    { key: STATES.PAYMENT, label: "Pay" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === state);

  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              i <= currentIndex ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {i + 1}
          </div>
          <span className="text-sm">{step.label}</span>
          {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}