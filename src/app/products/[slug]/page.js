// // app/products/[slug]/page.js
// export default async function ProductPage({ params }) {
//   const { slug } = await params;

//   return <div>Product: {slug}</div>;
// }

// app/products/[slug]/page.js
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { query } from "@/lib/db";
import AddToCartButton from "@/app/components/AddToCartButton";

// metadata
export async function generateMetadata({ params }) {
  const {slug} = await params;
  const { rows } = await query(
    "SELECT name, description, image_url, price_cents FROM products WHERE slug = $1",
    [slug]
  );
  const product = rows[0];
  if (!product) return { title: "Not found" };

  return {
    title: `${product.name} | Mctaba Shop`,
    description: product.description?.slice(0, 160) || "Available at Mctaba.",
    openGraph: {
      title: product.name,
      description: `KSh ${(product.price_cents / 100).toLocaleString()} - ${product.description}`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const {slug} = await params;
  const { rows } = await query(
    `SELECT id, slug, name, description, price_cents, image_url, stock, category
     FROM products WHERE slug = $1`,
    [slug]
  );

  const product = rows[0];
  if (!product) notFound();

  const { rows: related } = await query(
    `SELECT slug, name, price_cents FROM products
     WHERE category = $1 AND slug != $2
     ORDER BY random()
     LIMIT 3`,
    [product.category, product.slug]
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> / {product.name}
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl mt-2">KSh {(product.price_cents / 100).toLocaleString()}</p>

          {product.stock > 0 ? (
            <p className="text-green-700 text-sm mt-2">In stock ({product.stock} available)</p>
          ) : (
            <p className="text-red-600 text-sm mt-2">Out of stock</p>
          )}

          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-4">Related products</h2>
          <div className="grid grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/products/${r.slug}`} className="border p-4 rounded hover:shadow">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-gray-600">
                  KSh {(r.price_cents / 100).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}