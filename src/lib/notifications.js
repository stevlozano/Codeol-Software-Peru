// Servicio de notificaciones push
// Integrado con Supabase para persistir notificaciones

import { supabase, isSupabaseConfigured } from './supabase'

// Verificar si el navegador soporta notificaciones
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator
}

// Solicitar permiso de notificaciones
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return { granted: false, error: 'Notificaciones no soportadas' }
  }

  const permission = await Notification.requestPermission()
  
  if (permission === 'granted') {
    // Guardar en Supabase que el usuario aceptó notificaciones
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('customer_preferences')
          .upsert({
            customerId: user.id,
            notificationsEnabled: true,
            updatedAt: new Date().toISOString()
          })
      }
    }
    
    // Guardar en localStorage como fallback
    localStorage.setItem('codeol-notifications-enabled', 'true')
    
    return { granted: true }
  }
  
  return { granted: false, error: 'Permiso denegado' }
}

// Verificar si las notificaciones están habilitadas
export const areNotificationsEnabled = () => {
  const localEnabled = localStorage.getItem('codeol-notifications-enabled') === 'true'
  return localEnabled && Notification.permission === 'granted'
}

// Enviar notificación local
export const sendLocalNotification = (title, options = {}) => {
  if (!areNotificationsEnabled()) return

  const notification = new Notification(title, {
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: options.tag || Date.now().toString(),
    requireInteraction: options.requireInteraction || false,
    ...options
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
    if (options.onClick) options.onClick()
  }

  return notification
}

// Guardar notificación en Supabase
export const saveNotification = async (notification) => {
  if (!isSupabaseConfigured()) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('notifications')
    .insert({
      customerId: user.id,
      title: notification.title,
      message: notification.body || '',
      type: notification.type || 'general',
      read: false,
      createdAt: new Date().toISOString()
    })

  if (error) console.error('Error saving notification:', error)
}

// Obtener notificaciones del usuario
export const getNotifications = async () => {
  if (!isSupabaseConfigured()) {
    // Fallback a localStorage
    const saved = localStorage.getItem('codeol-notifications')
    return saved ? JSON.parse(saved) : []
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('customerId', user.id)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

// Marcar notificación como leída
export const markNotificationAsRead = async (notificationId) => {
  if (!isSupabaseConfigured()) {
    // Fallback a localStorage
    const saved = localStorage.getItem('codeol-notifications')
    if (saved) {
      const notifications = JSON.parse(saved)
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      localStorage.setItem('codeol-notifications', JSON.stringify(updated))
    }
    return
  }

  await supabase
    .from('notifications')
    .update({ read: true, readAt: new Date().toISOString() })
    .eq('id', notificationId)
}

// Notificaciones para eventos específicos
export const notifyOrderCreated = (orderId, total) => {
  sendLocalNotification('¡Orden creada!', {
    body: `Tu orden #${orderId} por S/ ${total} ha sido registrada.`,
    tag: `order-${orderId}`,
    type: 'order'
  })
}

export const notifyOrderStatusChange = (orderId, status) => {
  const statusText = {
    'pending': 'pendiente',
    'approved': 'aprobada',
    'rejected': 'rechazada'
  }[status] || status

  sendLocalNotification('Estado de orden actualizado', {
    body: `Tu orden #${orderId} ahora está ${statusText}.`,
    tag: `order-status-${orderId}`,
    type: 'order-status'
  })
}

export const notifyNewPromotion = (promoTitle, discount) => {
  sendLocalNotification('¡Nueva promoción!', {
    body: `${promoTitle} - ${discount}% de descuento solo para miembros`,
    tag: `promo-${Date.now()}`,
    type: 'promotion'
  })
}

// Suscribirse a cambios en tiempo real (Supabase Realtime)
export const subscribeToNotifications = (callback) => {
  if (!isSupabaseConfigured()) return null

  const subscription = supabase
    .channel('notifications')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return subscription
}

// Cancelar suscripción
export const unsubscribeFromNotifications = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
}
