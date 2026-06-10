CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);

INSERT INTO products (slug, name, description, price_cents, image_url, stock, category) VALUES
  ('nokia-105', 'Nokia 105', 'Dual SIM feature phone with FM radio. Lasts days on one charge.', 250000, '/products/nokia-105.jpg', 47, 'phones'),
  ('tecno-spark-10', 'Tecno Spark 10', 'Budget Android with 6.6 inch screen and 50MP camera.', 1599900, '/products/tecno-spark.jpg', 12, 'phones'),
  ('samsung-a05', 'Samsung A05', 'Entry-level Samsung with solid build and good battery.', 1899900, '/products/samsung-a05.jpg', 8, 'phones'),
  ('infinix-hot-40', 'Infinix Hot 40', 'Gamer-friendly with 120Hz display and 90W fast charging.', 2499900, '/products/infinix-hot-40.jpg', 5, 'phones'),
  ('oraimo-powerbank', 'Oraimo 20000mAh Power Bank', 'Charges your phone five times. Fast charging in and out.', 250000, '/products/oraimo-pb.jpg', 30, 'accessories');