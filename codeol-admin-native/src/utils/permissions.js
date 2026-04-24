import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'

export const checkAndRequestPermissions = async () => {
  const permissions = []

  // Camera permission
  const cameraStatus = await check(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
  )
  
  if (cameraStatus !== RESULTS.GRANTED) {
    permissions.push({
      name: 'Cámara',
      icon: 'camera',
      status: cameraStatus,
      request: async () => {
        const result = await request(
          Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
        )
        return result === RESULTS.GRANTED
      },
    })
  }

  // Photo Library permission
  const photoStatus = await check(
    Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.PHOTO_LIBRARY 
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  )
  
  if (photoStatus !== RESULTS.GRANTED) {
    permissions.push({
      name: 'Galería de fotos',
      icon: 'image',
      status: photoStatus,
      request: async () => {
        const result = await request(
          Platform.OS === 'ios' 
            ? PERMISSIONS.IOS.PHOTO_LIBRARY 
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        )
        return result === RESULTS.GRANTED
      },
    })
  }

  // Microphone permission
  const micStatus = await check(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO
  )
  
  if (micStatus !== RESULTS.GRANTED) {
    permissions.push({
      name: 'Micrófono',
      icon: 'microphone',
      status: micStatus,
      request: async () => {
        const result = await request(
          Platform.OS === 'ios' 
            ? PERMISSIONS.IOS.MICROPHONE 
            : PERMISSIONS.ANDROID.RECORD_AUDIO
        )
        return result === RESULTS.GRANTED
      },
    })
  }

  // Location permission
  const locationStatus = await check(
    Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
  
  if (locationStatus !== RESULTS.GRANTED) {
    permissions.push({
      name: 'Ubicación',
      icon: 'map-marker',
      status: locationStatus,
      request: async () => {
        const result = await request(
          Platform.OS === 'ios' 
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        )
        return result === RESULTS.GRANTED
      },
    })
  }

  return permissions
}

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permiso de almacenamiento',
          message: 'La app necesita acceso al almacenamiento para guardar archivos',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar',
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn(err)
      return false
    }
  }
  return true
}

export const showPermissionSettingsAlert = (permissionName) => {
  Alert.alert(
    'Permiso requerido',
    `Necesitas habilitar el permiso de ${permissionName} en la configuración de la app.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Abrir configuración', 
        onPress: () => Linking.openSettings() 
      },
    ]
  )
}

export const getPermissionStatusColor = (status) => {
  switch (status) {
    case RESULTS.GRANTED:
      return '#10b981'
    case RESULTS.DENIED:
      return '#eab308'
    case RESULTS.BLOCKED:
      return '#ef4444'
    case RESULTS.UNAVAILABLE:
      return '#666'
    default:
      return '#666'
  }
}
