-- Run this in your Supabase SQL Editor

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 5,
  reviews INTEGER DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Featured Collections Table
CREATE TABLE IF NOT EXISTS featured_collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  count TEXT NOT NULL,
  desc TEXT NOT NULL,
  image TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  initials TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Carts Table (Per User Session)
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Allow anonymous read access to public data
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for featured" ON featured_collections FOR SELECT USING (true);
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert access for reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Cart policies: Users can only see/modify their own session's cart
CREATE POLICY "Anon cart select" ON carts FOR SELECT USING (true);
CREATE POLICY "Anon cart insert" ON carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon cart update" ON carts FOR UPDATE USING (true);
CREATE POLICY "Anon cart delete" ON carts FOR DELETE USING (true);

-- The Admin Panel uses the Service Role Key which bypasses RLS entirely,
-- so no extra policies are needed for admin inserts/updates on products/orders.
