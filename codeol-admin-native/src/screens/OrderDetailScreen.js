import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params

  const updateStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      if (error) throw error

      Alert.alert('Éxito', 'Estado actualizado correctamente')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const shareOrder = async () => {
    try {
      const message = `
Pedido #${order.id.slice(-6)}
Cliente: ${order.customer_name}
Email: ${order.customer_email}
Teléfono: ${order.customer_phone}
Total: S/ ${(order.total_price * 1.18).toFixed(2)}
Estado: ${order.status === 'pending' ? 'Pendiente' : order.status === 'approved' ? 'Aprobado' : 'Rechazado'}
      `.trim()

      await Share.share({
        message,
        title: `Pedido #${order.id.slice(-6)}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusColor = () => {
    switch (order.status) {
      case 'approved':
        return '#10b981'
      case 'rejected':
        return '#ef4444'
      default:
        return '#eab308'
    }
  }

  const getStatusText = () => {
    switch (order.status) {
      case 'approved':
        return 'Aprobado'
      case 'rejected':
        return 'Rechazado'
      default:
        return 'Pendiente'
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderLabel}>Pedido</Text>
          <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
        </View>
        <TouchableOpacity onPress={shareOrder} style={styles.shareButton}>
          <Icon name="share-variant" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {format(new Date(order.created_at), 'PPP p', { locale: es })}
        </Text>
      </View>

      {/* Customer Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del Cliente</Text>
        
        <View style={styles.infoRow}>
          <Icon name="account" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>{order.customer_name || 'No disponible'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="email" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{order.customer_email || 'No disponible'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{order.customer_phone || 'No disponible'}</Text>
          </View>
        </View>

        {order.customer_company && (
          <View style={styles.infoRow}>
            <Icon name="office-building" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{order.customer_company}</Text>
            </View>
          </View>
        )}

        {order.customer_ruc && (
          <View style={styles.infoRow}>
            <Icon name="card-account-details" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>RUC</Text>
              <Text style={styles.infoValue}>{order.customer_ruc}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Servicios Contratados</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{index + 1}. {item.name}</Text>
              <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              S/ {item.customPrice ? (item.customPrice * item.quantity).toFixed(2) : 'Cotizar'}
            </Text>
          </View>
        ))}
      </View>

      {/* Payment */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de Pago</Text>
        
        <View style={styles.infoRow}>
          <Icon name="credit-card" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Método de pago</Text>
            <Text style={styles.infoValue}>{order.payment_method || 'No especificado'}</Text>
          </View>
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>S/ {order.total_price?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IGV (18%)</Text>
            <Text style={styles.totalValue}>S/ {(order.total_price * 0.18).toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>TOTAL</Text>
            <Text style={styles.finalTotalValue}>S/ {(order.total_price * 1.18).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {order.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => updateStatus('approved')}
          >
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Aprobar Pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => updateStatus('rejected')}
          >
            <Icon name="close" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Rechazar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  totalsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#888',
  },
  totalValue: {
    fontSize: 14,
    color: '#fff',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  actions: {
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
