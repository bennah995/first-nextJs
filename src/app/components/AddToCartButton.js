// app/components/AddToCartButton.js
"use client";
import Button from "./Button";
import { useState } from "react";

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);

  async function handleClick() {
    // Real cart logic is Week 15. For today, a placeholder.
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? "Out of stock" : added ? "Added!" : "Add to cart"}
    </button>
  );
}