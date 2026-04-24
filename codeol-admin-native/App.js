import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'
import { requestUserPermission, notificationListeners, createNotificationChannel, getFcmToken } from './src/utils/notifications'

export default function App() {
  useEffect(() => {
    // Initialize notifications
    const initNotifications = async () => {
      // Create notification channel for Android
      createNotificationChannel()
      
      // Request permission
      const hasPermission = await requestUserPermission()
      
      if (hasPermission) {
        // Get FCM token
        await getFcmToken()
        
        // Set up notification listeners
        notificationListeners()
      }
    }

    initNotifications()
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <AppNavigator />
    </>
  )
}
