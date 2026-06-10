// app/products/loading.js
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded p-4">
            <div className="aspect-square bg-gray-200 animate-pulse mb-3" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}