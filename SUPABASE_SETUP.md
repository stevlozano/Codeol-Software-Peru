# Configuración de Supabase

## Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto
3. Espera a que se termine de configurar

## Paso 2: Obtener credenciales

1. Ve a **Project Settings** (engranaje) → **API**
2. Copia:
   - **URL** (ej: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key

## Paso 3: Configurar variables de entorno

1. Crea archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

2. Reemplaza con tus credenciales reales

## Paso 4: Crear tabla de clientes

1. Ve al **SQL Editor** en Supabase
2. Crea una **New query**
3. Copia y ejecuta el contenido de `supabase-schema.sql`

O ejecuta esto directamente:

```sql
-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  password TEXT,
  referralCode TEXT UNIQUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert during signup" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Paso 5: Habilitar autenticación por email

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Deshabilita **Confirm email** (para simplificar, o déjalo habilitado si quieres verificación)

## Paso 6: Instalar dependencias

```bash
npm install @supabase/supabase-js
```

## Paso 7: Probar

1. Inicia el servidor: `npm run dev`
2. Ve a `/login`
3. Crea una cuenta - ahora funcionará en cualquier navegador/dispositivo!

## Notas importantes

- **Fallback**: Si Supabase no está configurado, el sistema seguirá funcionando con localStorage
- **Seguridad**: En producción, considera usar hashing de contraseñas
- **RLS**: Row Level Security está configurado para que cada usuario solo vea sus propios datos

## Solución de problemas

### Error: "Invalid API key"
- Verifica que la `VITE_SUPABASE_ANON_KEY` sea correcta
- Asegúrate de que no tenga espacios al final

### Error: "relation 'customers' does not exist"
- Ejecuta el SQL para crear la tabla en el SQL Editor de Supabase

### Usuarios no persisten entre navegadores
- Verifica que Supabase esté correctamente configurado
- Revisa la consola del navegador por errores
