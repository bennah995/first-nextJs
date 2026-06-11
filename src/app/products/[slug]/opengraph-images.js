// app/products/[slug]/opengraph-image.js
import { ImageResponse } from "next/og";
import { query } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { rows } = await query(
    "SELECT name, price_cents FROM products WHERE slug = $1",
    [params.slug]
  );
  const product = rows[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf9f6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#1a1a1a" }}>
          {product?.name || "Mctaba"}
        </div>
        <div style={{ fontSize: 48, color: "#16a34a", marginTop: 24 }}>
          KSh {product ? (product.price_cents / 100).toLocaleString() : ""}
        </div>
        <div style={{ fontSize: 24, color: "#888", marginTop: 40 }}>mctaba.co.ke</div>
      </div>
    ),
    { ...size }
  );
}