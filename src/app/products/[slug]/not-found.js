// app/products/[slug]/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-16 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="mt-4 text-gray-600">
        We could not find the product you were looking for. It may have been sold or removed.
      </p>
      <Link href="/products" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded">
        Browse all products
      </Link>
    </div>
  );
}