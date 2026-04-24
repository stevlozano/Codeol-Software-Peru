import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const CustomerAuthContext = createContext()

// Sistema de niveles de fidelidad
export const LOYALTY_LEVELS = {
  BRONZE: { name: 'Bronce', discount: 0.05, minOrders: 0, color: '#CD7F32' },
  SILVER: { name: 'Plata', discount: 0.10, minOrders: 2, color: '#C0C0C0' },
  GOLD: { name: 'Oro', discount: 0.15, minOrders: 6, color: '#FFD700' }
}

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loyaltyLevel, setLoyaltyLevel] = useState(LOYALTY_LEVELS.BRONZE)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  // Cargar sesión al iniciar - desde Supabase o localStorage
  useEffect(() => {
    // Skip loading if on admin pages to prevent 406 errors
    if (window.location.pathname.startsWith('/admin')) {
      return
    }
    loadSession()
  }, [])

  const loadSession = async () => {
    // Intentar cargar desde Supabase primero
    if (isSupabaseConfigured()) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // First check if user is an admin to avoid 406 error
        const { data: adminCheck } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()
        
        // If user is admin, don't try to load as customer
        if (adminCheck) {
          return
        }
        
        // Try to load as customer
        const { data: profile, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (profile) {
          const { password, ...customerData } = profile
          setCustomer(customerData)
          setIsLoggedIn(true)
          updateLoyaltyStats(profile.email)
          return
        }
      }
    }
    
    // Fallback a localStorage
    const savedCustomer = localStorage.getItem('codeol-customer')
    if (savedCustomer) {
      const parsed = JSON.parse(savedCustomer)
      setCustomer(parsed)
      setIsLoggedIn(true)
      updateLoyaltyStats(parsed.email)
    }
  }

  // Actualizar estadísticas de fidelidad
  const updateLoyaltyStats = (email) => {
    const allOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
    const customerOrders = allOrders.filter(o => 
      o.customer?.email === email && o.status === 'approved'
    )
    
    const orderCount = customerOrders.length
    const spent = customerOrders.reduce((sum, o) => sum + ((o.totalPrice || 0) * 1.18), 0)
    
    setTotalOrders(orderCount)
    setTotalSpent(spent)
    
    // Calcular nivel
    if (orderCount >= LOYALTY_LEVELS.GOLD.minOrders || spent >= 3000) {
      setLoyaltyLevel(LOYALTY_LEVELS.GOLD)
    } else if (orderCount >= LOYALTY_LEVELS.SILVER.minOrders) {
      setLoyaltyLevel(LOYALTY_LEVELS.SILVER)
    } else {
      setLoyaltyLevel(LOYALTY_LEVELS.BRONZE)
    }
  }

  // Registro
  const register = async (userData) => {
    console.log('Register called, Supabase configured:', isSupabaseConfigured())
    
    // Verificar si email ya existe en Supabase
    if (isSupabaseConfigured()) {
      try {
        // Verificar si email ya existe
        const { data: existing, error: existingError } = await supabase
          .from('customers')
          .select('email')
          .eq('email', userData.email)
          .maybeSingle()
        
        if (existingError) {
          console.error('Error checking existing user:', existingError)
        }
        
        if (existing) {
          return { success: false, error: 'Este correo ya está registrado' }
        }
        
        // Crear usuario en auth de Supabase
        console.log('Creating auth user...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password
        })
        
        if (authError) {
          console.error('Auth error:', authError)
          return { success: false, error: authError.message }
        }
        
        if (!authData.user) {
          console.error('No user returned from auth signup')
          return { success: false, error: 'Error al crear usuario' }
        }
        
        console.log('Auth user created:', authData.user.id)
        
        // Step 2: Sign in to get active session (required for RLS policy)
        console.log('Signing in to get session...')
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        })
        
        if (signInError) {
          console.error('Sign in error:', signInError)
          return { success: false, error: `Error al iniciar sesión: ${signInError.message}` }
        }
        
        // Step 3: Crear perfil en tabla customers (now with active session)
        const newUser = {
          id: authData.user.id,
          nombre: userData.nombre,
          email: userData.email,
          telefono: userData.telefono || '',
          password: userData.password,
          referral_code: `CODEOL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          created_at: new Date().toISOString()
        }
        
        console.log('Inserting to customers table:', newUser)
        
        const { data: insertData, error: profileError } = await supabase
          .from('customers')
          .insert(newUser)
          .select()
        
        if (profileError) {
          console.error('Profile insert error:', profileError)
          return { success: false, error: `Error al guardar perfil: ${profileError.message}` }
        }
        
        console.log('User registered successfully in Supabase')
        
        // Iniciar sesión automáticamente
        const { password, ...customerData } = newUser
        setCustomer(customerData)
        setIsLoggedIn(true)
        localStorage.setItem('codeol-customer', JSON.stringify(customerData))
        
        return { success: true }
      } catch (err) {
        console.error('Registration error:', err)
        return { success: false, error: err.message || 'Error en el registro' }
      }
    }
    
    // Fallback: localStorage
    const existingUsers = JSON.parse(localStorage.getItem('codeol-customers') || '[]')
    if (existingUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'Este correo ya está registrado' }
    }
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      referral_code: `CODEOL${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
    
    existingUsers.push(newUser)
    localStorage.setItem('codeol-customers', JSON.stringify(existingUsers))
    
    const { password, ...customerData } = newUser
    setCustomer(customerData)
    setIsLoggedIn(true)
    localStorage.setItem('codeol-customer', JSON.stringify(customerData))
    
    return { success: true }
  }

  // Login
  const login = async (email, password) => {
    // Intentar login con Supabase
    if (isSupabaseConfigured()) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) {
        return { success: false, error: 'Correo o contraseña incorrectos' }
      }
      
      const { data: profile } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      
      if (profile) {
        const { password: _, ...customerData } = profile
        setCustomer(customerData)
        setIsLoggedIn(true)
        localStorage.setItem('codeol-customer', JSON.stringify(customerData))
        updateLoyaltyStats(email)
        return { success: true }
      }
    }
    
    // Fallback: localStorage
    const existingUsers = JSON.parse(localStorage.getItem('codeol-customers') || '[]')
    const user = existingUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos' }
    }
    
    const { password: _, ...customerData } = user
    setCustomer(customerData)
    setIsLoggedIn(true)
    localStorage.setItem('codeol-customer', JSON.stringify(customerData))
    updateLoyaltyStats(email)
    
    return { success: true }
  }

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setCustomer(null)
    setIsLoggedIn(false)
    setLoyaltyLevel(LOYALTY_LEVELS.BRONZE)
    setTotalOrders(0)
    setTotalSpent(0)
    localStorage.removeItem('codeol-customer')
  }

  // Actualizar perfil
  const updateProfile = async (updates) => {
    if (isSupabaseConfigured() && customer?.id) {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customer.id)
      
      if (error) {
        console.error('Error updating profile:', error)
        return
      }
    }
    
    // Actualizar también en localStorage
    const existingUsers = JSON.parse(localStorage.getItem('codeol-customers') || '[]')
    const updatedUsers = existingUsers.map(u => 
      u.id === customer.id ? { ...u, ...updates } : u
    )
    localStorage.setItem('codeol-customers', JSON.stringify(updatedUsers))
    
    const { password, ...customerData } = { ...customer, ...updates }
    setCustomer(customerData)
    localStorage.setItem('codeol-customer', JSON.stringify(customerData))
  }

  // Obtener historial de compras
  const getOrderHistory = async () => {
    if (!customer) return []
    
    // Try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', customer.email)
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform to expected format
          return data.map(order => ({
            id: order.id,
            customer: {
              nombre: order.customer_name,
              email: order.customer_email,
              telefono: order.customer_phone,
              empresa: order.customer_company,
              ruc: order.customer_ruc,
              direccion: order.customer_address
            },
            items: order.items,
            totalPrice: order.total_price,
            paymentMethod: order.payment_method,
            status: order.status,
            createdAt: order.created_at
          }))
        }
      } catch (err) {
        console.error('Error fetching order history from Supabase:', err)
      }
    }
    
    // Fallback to localStorage
    const allOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
    return allOrders.filter(o => o.customer?.email === customer.email).sort((a, b) => 
      new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
    )
  }

  // Calcular descuento aplicable a un monto
  const calculateDiscount = (amount) => {
    return amount * loyaltyLevel.discount
  }

  // Obtener progreso al siguiente nivel
  const getNextLevelProgress = () => {
    if (loyaltyLevel.name === 'Oro') return null
    
    const nextLevel = loyaltyLevel.name === 'Bronce' ? LOYALTY_LEVELS.SILVER : LOYALTY_LEVELS.GOLD
    const ordersNeeded = nextLevel.minOrders - totalOrders
    const spentNeeded = 3000 - totalSpent // Para nivel Oro por monto
    
    return {
      level: nextLevel,
      ordersNeeded: Math.max(0, ordersNeeded),
      spentNeeded: Math.max(0, spentNeeded),
      progressPercent: Math.min(100, (totalOrders / nextLevel.minOrders) * 100)
    }
  }

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      isLoggedIn,
      loyaltyLevel,
      totalOrders,
      totalSpent,
      register,
      login,
      logout,
      updateProfile,
      getOrderHistory,
      calculateDiscount,
      getNextLevelProgress,
      updateLoyaltyStats
    }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export const useCustomerAuth = () => useContext(CustomerAuthContext)
