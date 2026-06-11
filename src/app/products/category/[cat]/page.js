import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";

export default async function CategoryPage({ params }) {
  const {cat} = await params;
  const { rows: products } = await query(
    "SELECT slug, name, price_cents FROM products WHERE category = $1 ORDER BY name",
    [cat]
  );

  if (products.length === 0) notFound();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold capitalize mb-6">{params.cat}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="border p-4 rounded hover:shadow">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">
              KSh {(p.price_cents / 100).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { rows } = await query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL");
  return rows.map((r) => ({ cat: r.category }));
}