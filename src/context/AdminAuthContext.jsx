import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Verificar si el usuario es admin (tiene flag isAdmin en metadata)
        const { data: adminData, error } = await supabase
          .from('admins')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (adminData) {
          setAdmin(adminData)
          setIsLoggedIn(true)
        }
      }
    } catch (err) {
      console.error('Session check error:', err)
    }
    
    setLoading(false)
  }

  // Login
  const login = async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase no configurado' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Verificar si es admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (adminError || !adminData) {
        await supabase.auth.signOut()
        return { success: false, error: 'Esta cuenta no tiene permisos de administrador' }
      }

      setAdmin(adminData)
      setIsLoggedIn(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Registro
  const register = async (userData) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase no configurado' }
    }

    try {
      // Verificar si ya existe un admin
      const { data: existingAdmins, error: countError } = await supabase
        .from('admins')
        .select('id', { count: 'exact', head: true })

      if (countError) {
        console.error('Error checking existing admins:', countError)
      }

      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      // Crear perfil en tabla admins
      const newAdmin = {
        id: authData.user.id,
        nombre: userData.nombre,
        email: userData.email,
        createdAt: new Date().toISOString()
      }

      const { error: insertError } = await supabase
        .from('admins')
        .insert(newAdmin)

      if (insertError) {
        console.error('Error inserting admin:', insertError)
        return { success: false, error: `Error al guardar admin: ${insertError.message}` }
      }

      // Iniciar sesión automáticamente
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      })

      if (signInError) {
        return { success: true, message: 'Cuenta creada. Inicia sesión.' }
      }

      setAdmin(newAdmin)
      setIsLoggedIn(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    setIsLoggedIn(false)
  }

  const value = {
    admin,
    isLoggedIn,
    loading,
    login,
    register,
    logout
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  }
  return context
}
