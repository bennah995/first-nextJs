// app/sitemap.js
import { query } from "@/lib/db";

export default async function sitemap() {
  const { rows: products } = await query("SELECT slug, created_at FROM products");

  const staticRoutes = [
    { url: "https://yourdomain.com/", lastModified: new Date() },
    { url: "https://yourdomain.com/products", lastModified: new Date() },
    { url: "https://yourdomain.com/about", lastModified: new Date() },
    { url: "https://yourdomain.com/contact", lastModified: new Date() },
  ];

  const productRoutes = products.map((p) => ({
    url: `https://yourdomain.com/products/${p.slug}`,
    lastModified: new Date(p.created_at),
  }));

  return [...staticRoutes, ...productRoutes];
}