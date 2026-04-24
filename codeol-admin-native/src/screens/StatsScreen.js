import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LineChart, BarChart } from 'react-native-chart-kit'
import { supabase } from '../lib/supabase'
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

const { width } = Dimensions.get('window')

export default function StatsScreen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    approvedOrders: 0,
    pendingOrders: 0,
    rejectedOrders: 0,
    averageOrderValue: 0,
  })

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const ordersList = data || []
      setOrders(ordersList)

      // Calculate stats
      const approved = ordersList.filter(o => o.status === 'approved')
      const totalRevenue = approved.reduce((sum, o) => sum + o.total_price, 0)

      setStats({
        totalRevenue,
        totalOrders: ordersList.length,
        approvedOrders: approved.length,
        pendingOrders: ordersList.filter(o => o.status === 'pending').length,
        rejectedOrders: ordersList.filter(o => o.status === 'rejected').length,
        averageOrderValue: approved.length > 0 ? totalRevenue / approved.length : 0,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  })

  const dailyRevenue = last7Days.map(day => {
    return orders
      .filter(o => {
        const orderDate = new Date(o.created_at)
        return o.status === 'approved' &&
          orderDate.getDate() === day.getDate() &&
          orderDate.getMonth() === day.getMonth()
      })
      .reduce((sum, o) => sum + o.total_price, 0)
  })

  const chartConfig = {
    backgroundColor: '#0a0a0a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#1a1a1a',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#10b981',
    },
  }

  return (
    <ScrollView style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="cash" size={24} color="#10b981" />
          <Text style={styles.statValue}>S/ {stats.totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Ingresos totales</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="shopping" size={24} color="#10b981" />
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total pedidos</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statValue}>{stats.approvedOrders}</Text>
          <Text style={styles.statLabel}>Aprobados</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="clock" size={24} color="#eab308" />
          <Text style={styles.statValue}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      {/* Average Order Value */}
      <View style={styles.averageCard}>
        <Text style={styles.averageLabel}>Valor promedio de pedido</Text>
        <Text style={styles.averageValue}>S/ {stats.averageOrderValue.toFixed(2)}</Text>
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ingresos últimos 7 días</Text>
        <LineChart
          data={{
            labels: last7Days.map(d => format(d, 'dd/MM')),
            datasets: [{
              data: dailyRevenue,
            }],
          }}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Status Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de pedidos</Text>
        <BarChart
          data={{
            labels: ['Aprobados', 'Pendientes', 'Rechazados'],
            datasets: [{
              data: [
                stats.approvedOrders,
                stats.pendingOrders,
                stats.rejectedOrders,
              ],
            }],
          }}
          width={width - 32}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  averageCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  averageLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
  },
  chartContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})
