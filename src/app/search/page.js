import Link from "next/link";
import { query } from "@/lib/db";

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";

  let results = [];
  if (q.length >= 2) {
    const { rows } = await query(
      `SELECT slug, name, price_cents FROM products
       WHERE name ILIKE $1 OR description ILIKE $1
       ORDER BY name LIMIT 20`,
      [`%${q}%`]
    );
    results = rows;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <form action="/search" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="w-full border p-3 rounded"
        />
      </form>

      {q && (
        <div className="mt-6">
          <p className="text-gray-500 mb-4">{results.length} result(s) for "{q}"</p>
          <ul className="space-y-2">
            {results.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="hover:underline">
                  {p.name} - KSh {(p.price_cents / 100).toLocaleString()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}