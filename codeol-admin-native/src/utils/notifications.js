import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid, Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import PushNotification from 'react-native-push-notification'

// Configure local notifications
PushNotification.configure({
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION:', notification)
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
})

export const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      console.log('iOS Push notifications permission:', enabled)
      return enabled
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      )
      console.log('Android Push notifications permission:', granted)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }

    return false
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken()
    console.log('FCM Token:', token)
    
    // Save token to Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user && token) {
      await supabase
        .from('admin_tokens')
        .upsert({
          user_id: user.id,
          fcm_token: token,
          updated_at: new Date().toISOString(),
        })
    }
    
    return token
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

export const notificationListeners = () => {
  // Foreground message handler
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage)
    
    // Show local notification
    PushNotification.localNotification({
      channelId: 'codeol-admin-channel',
      title: remoteMessage.notification?.title || 'CODEOL Admin',
      message: remoteMessage.notification?.body || 'Nueva notificación',
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
    })
  })

  // Background message handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage)
  })

  // Token refresh handler
  messaging().onTokenRefresh(async token => {
    console.log('FCM Token refreshed:', token)
    const { data: { user } } = await supabase.auth.getUser()
    if (user && token) {
      await supabase
        .from('admin_tokens')
        .upsert({
          user_id: user.id,
          fcm_token: token,
          updated_at: new Date().toISOString(),
        })
    }
  })

  // Notification opened app from background
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log('Notification opened app:', remoteMessage)
  })

  // Check if app was opened from a notification (quit state)
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state:', remoteMessage)
      }
    })
}

export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'codeol-admin-channel',
      channelName: 'CODEOL Admin Notifications',
      channelDescription: 'Notificaciones de pedidos y ventas',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`CreateChannel returned '${created}'`)
  )
}
