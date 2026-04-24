-- SQL para crear las tablas necesarias en Supabase
-- Ejecutar esto en el SQL Editor de Supabase

-- Tabla de clientes
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

-- Tabla de órdenes (opcional - si quieres sincronizar órdenes también)
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
