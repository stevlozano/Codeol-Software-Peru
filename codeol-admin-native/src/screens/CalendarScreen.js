import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'

const { width } = Dimensions.get('window')

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [dayOrders, setDayOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [currentMonth])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startOfMonth(currentMonth).toISOString())
        .lte('created_at', endOfMonth(currentMonth).toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const getDaysInMonth = () => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    })
  }

  const getOrdersForDay = (day) => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return isSameDay(orderDate, day)
    })
  }

  const getDayRevenue = (day) => {
    return getOrdersForDay(day)
      .filter(o => o.status === 'approved')
      .reduce((sum, o) => sum + o.total_price, 0)
  }

  const handleDayPress = (day) => {
    setSelectedDate(day)
    setDayOrders(getOrdersForDay(day))
  }

  const days = getDaysInMonth()
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Icon name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </Text>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Icon name="chevron-right" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekDays}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          const dayOrders = getOrdersForDay(day)
          const hasOrders = dayOrders.length > 0
          const revenue = getDayRevenue(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
                {format(day, 'd')}
              </Text>
              {hasOrders && (
                <View style={styles.dayIndicator}>
                  <Text style={styles.dayRevenue}>S/ {revenue.toFixed(0)}</Text>
                  <View style={styles.orderDot} />
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total pedidos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            S/ {orders.filter(o => o.status === 'approved').reduce((sum, o) => sum + o.total_price, 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Ventas aprobadas</Text>
        </View>
      </View>

      {/* Day Orders */}
      {selectedDate && (
        <View style={styles.dayOrdersContainer}>
          <Text style={styles.dayOrdersTitle}>
            Pedidos del {format(selectedDate, 'dd/MM/yyyy')}
          </Text>
          <ScrollView style={styles.dayOrdersList}>
            {dayOrders.length === 0 ? (
              <Text style={styles.noOrdersText}>No hay pedidos este día</Text>
            ) : (
              dayOrders.map(order => (
                <View key={order.id} style={styles.dayOrderCard}>
                  <View style={styles.dayOrderHeader}>
                    <Text style={styles.dayOrderId}>#{order.id.slice(-6)}</Text>
                    <View style={[
                      styles.dayOrderStatus,
                      { backgroundColor: order.status === 'approved' ? '#10b981' : order.status === 'rejected' ? '#ef4444' : '#eab308' }
                    ]}>
                      <Text style={styles.dayOrderStatusText}>
                        {order.status === 'approved' ? 'A' : order.status === 'rejected' ? 'R' : 'P'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dayOrderCustomer}>{order.customer_name || 'Sin nombre'}</Text>
                  <Text style={styles.dayOrderTotal}>S/ {(order.total_price * 1.18).toFixed(2)}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
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
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  weekDays: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  dayCell: {
    width: (width - 16) / 7,
    height: 70,
    padding: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  selectedDay: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  dayNumber: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#10b981',
  },
  dayIndicator: {
    alignItems: 'center',
    marginTop: 4,
  },
  dayRevenue: {
    fontSize: 10,
    color: '#10b981',
  },
  orderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  dayOrdersContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  dayOrdersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  dayOrdersList: {
    flex: 1,
  },
  noOrdersText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  dayOrderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  dayOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayOrderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  dayOrderStatus: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOrderStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dayOrderCustomer: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  dayOrderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
})
