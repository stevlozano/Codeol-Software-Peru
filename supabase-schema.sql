-- SQL para crear las tablas necesarias en Supabase
-- Ejecutar esto en el SQL Editor de Supabase

-- ============================================
-- TABLA DE CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  password TEXT, -- En producción usar hash
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert during signup" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLA DE ÓRDENES
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT,
  items JSONB,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- ============================================
-- TABLA DE NOTIFICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'general', -- general, order, order-status, promotion
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = customer_id);

-- ============================================
-- TABLA DE PREFERENCIAS DE CLIENTE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_preferences (
  customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  promo_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON customer_preferences
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can update own preferences" ON customer_preferences
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own preferences" ON customer_preferences
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ============================================
-- TABLA DE PROMOCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  code TEXT UNIQUE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- No RLS needed for promotions - they're public
-- But we can add policies if needed in the future
