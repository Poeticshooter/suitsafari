-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TAILORS
CREATE TABLE public.tailors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  shop_name TEXT,
  address TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  specialties TEXT[] DEFAULT '{}',
  base_price_shirt INT DEFAULT 300,
  base_price_pant INT DEFAULT 400,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_orders INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active','pending','cancelled')),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  garment_type TEXT NOT NULL CHECK (garment_type IN ('shirt','pant','kurta','suit','sherwani','other')),
  fabric_description TEXT,
  fabric_provided BOOLEAN DEFAULT true,
  price INT NOT NULL,
  commission INT DEFAULT 25,
  tailor_id UUID REFERENCES public.tailors(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','assigned','accepted','in_progress','completed','delivered','cancelled')),
  measurement_notes TEXT,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FABRIC PARTNERS
CREATE TABLE public.fabric_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  commission_percent INT DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. FABRICS
CREATE TABLE public.fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.fabric_partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  price_per_meter INT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ADMIN LOGS
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  details JSONB,
  admin_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_orders_tailor_id ON public.orders(tailor_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX idx_tailors_is_active ON public.tailors(is_active) WHERE is_active = true;
CREATE INDEX idx_tailors_rating ON public.tailors(rating DESC);
CREATE INDEX idx_tailors_phone ON public.tailors(phone);
CREATE INDEX idx_reviews_order ON public.reviews(order_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- ROW LEVEL SECURITY
ALTER TABLE public.tailors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Tailors: public can read active, only admin can write
CREATE POLICY "tailors_select_public" ON public.tailors
  FOR SELECT USING (is_active = true);

CREATE POLICY "tailors_all_admin" ON public.tailors
  USING (auth.role() = 'service_role');

-- Orders: public can insert, admin can do everything
CREATE POLICY "orders_insert_public" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_select_admin" ON public.orders
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Reviews: public can insert and read
CREATE POLICY "reviews_insert_public" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reviews_select_public" ON public.reviews
  FOR SELECT USING (true);

-- Fabric partners: admin only
CREATE POLICY "fabrics_all_admin" ON public.fabric_partners
  USING (auth.role() = 'service_role');

CREATE POLICY "fabrics_items_all_admin" ON public.fabrics
  USING (auth.role() = 'service_role');

-- Admin logs: admin only
CREATE POLICY "admin_logs_insert" ON public.admin_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_logs_select" ON public.admin_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- AUTO-INCREMENT ORDER NUMBER FUNCTION
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  seq_num INT;
BEGIN
  year_prefix := to_char(now(), 'YY');
  seq_num := nextval('orders_sequence');
  NEW.order_number := 'SS-' || year_prefix || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS orders_sequence START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- AUTO-UPDATE UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
