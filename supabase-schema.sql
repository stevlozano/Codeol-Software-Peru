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
  referralCode TEXT UNIQUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  customerId UUID REFERENCES customers(id),
  customerEmail TEXT,
  items JSONB,
  totalPrice DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  paymentMethod TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customerId);

-- ============================================
-- TABLA DE NOTIFICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customerId UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'general', -- general, order, order-status, promotion
  read BOOLEAN DEFAULT FALSE,
  readAt TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_notifications_customerId ON notifications(customerId);
CREATE INDEX IF NOT EXISTS idx_notifications_createdAt ON notifications(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = customerId);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = customerId);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = customerId);

-- ============================================
-- TABLA DE PREFERENCIAS DE CLIENTE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_preferences (
  customerId UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
  notificationsEnabled BOOLEAN DEFAULT FALSE,
  emailNotifications BOOLEAN DEFAULT TRUE,
  promoNotifications BOOLEAN DEFAULT TRUE,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON customer_preferences
  FOR SELECT USING (auth.uid() = customerId);

CREATE POLICY "Users can update own preferences" ON customer_preferences
  FOR UPDATE USING (auth.uid() = customerId);

CREATE POLICY "Users can insert own preferences" ON customer_preferences
  FOR INSERT WITH CHECK (auth.uid() = customerId);
