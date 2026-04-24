import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { supabase } from '../lib/supabase'
import { requestUserPermission, getFcmToken } from '../utils/notifications'
import { checkAndRequestPermissions, showPermissionSettingsAlert } from '../utils/permissions'

export default function ProfileScreen() {
  const [user, setUser] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
    checkPermissions()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const checkPermissions = async () => {
    const perms = await checkAndRequestPermissions()
    setPermissions(perms)
  }

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut()
          },
        },
      ]
    )
  }

  const toggleNotifications = async (value) => {
    if (value) {
      const granted = await requestUserPermission()
      if (granted) {
        await getFcmToken()
        setNotificationsEnabled(true)
      } else {
        Alert.alert('Permiso denegado', 'No se pudo activar las notificaciones')
        setNotificationsEnabled(false)
      }
    } else {
      setNotificationsEnabled(false)
    }
  }

  const requestPermission = async (permission) => {
    const granted = await permission.request()
    if (!granted && permission.status === 'blocked') {
      showPermissionSettingsAlert(permission.name)
    }
    checkPermissions()
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Icon name="account-circle" size={80} color="#10b981" />
        </View>
        <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Admin'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'admin@codeol.com'}</Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="bell" size={20} color="#10b981" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Notificaciones push</Text>
              <Text style={styles.settingDescription}>Recibir alertas de nuevos pedidos</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#333', true: '#10b981' }}
            thumbColor={notificationsEnabled ? '#fff' : '#888'}
          />
        </View>
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permisos de la app</Text>
        {permissions.length === 0 ? (
          <View style={styles.allPermissionsGranted}>
            <Icon name="check-circle" size={24} color="#10b981" />
            <Text style={styles.allPermissionsText}>Todos los permisos concedidos</Text>
          </View>
        ) : (
          permissions.map((permission, index) => (
            <TouchableOpacity
              key={index}
              style={styles.permissionItem}
              onPress={() => requestPermission(permission)}
            >
              <View style={styles.permissionInfo}>
                <Icon name={permission.icon} size={20} color="#eab308" />
                <Text style={styles.permissionName}>{permission.name}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoItem}>
          <Icon name="information" size={20} color="#666" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Versión</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Icon name="web" size={20} color="#666" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Sitio web</Text>
            <Text style={styles.infoValue}>codeolsoftware.work</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CODEOL Software Perú © 2025</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  userCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    color: '#fff',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  allPermissionsGranted: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  allPermissionsText: {
    color: '#10b981',
    fontSize: 14,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  permissionName: {
    fontSize: 16,
    color: '#fff',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
})
