// Página de diagnóstico para verificar conexión con Supabase
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function SupabaseDebug() {
  const [tests, setTests] = useState({
    configured: { status: 'pending', message: 'Verificando...' },
    connection: { status: 'pending', message: 'Verificando...' },
    auth: { status: 'pending', message: 'Verificando...' },
    table: { status: 'pending', message: 'Verificando...' }
  })
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // Test 1: Configuración
    const configured = isSupabaseConfigured()
    setTests(prev => ({
      ...prev,
      configured: {
        status: configured ? 'success' : 'error',
        message: configured ? 'Credenciales configuradas correctamente' : 'Faltan credenciales de Supabase'
      }
    }))
    addLog(`Supabase configurado: ${configured}`)

    if (!configured) {
      addLog('No se pueden ejecutar más tests sin configuración')
      return
    }

    // Test 2: Conexión básica
    try {
      const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true })
      if (error) {
        setTests(prev => ({
          ...prev,
          connection: { status: 'error', message: `Error de conexión: ${error.message}` }
        }))
        addLog(`Error de conexión: ${error.message}`)
      } else {
        setTests(prev => ({
          ...prev,
          connection: { status: 'success', message: 'Conexión a Supabase exitosa' }
        }))
        addLog('Conexión exitosa')
      }
    } catch (err) {
      setTests(prev => ({
        ...prev,
        connection: { status: 'error', message: `Error: ${err.message}` }
      }))
      addLog(`Error de conexión: ${err.message}`)
    }

    // Test 3: Auth
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setTests(prev => ({
          ...prev,
          auth: { status: 'error', message: `Error en auth: ${error.message}` }
        }))
        addLog(`Error de auth: ${error.message}`)
      } else {
        setTests(prev => ({
          ...prev,
          auth: { status: 'success', message: 'Servicio de autenticación disponible' }
        }))
        addLog('Auth disponible')
      }
    } catch (err) {
      setTests(prev => ({
        ...prev,
        auth: { status: 'error', message: `Error: ${err.message}` }
      }))
      addLog(`Error de auth: ${err.message}`)
    }

    // Test 4: Tabla customers
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .limit(1)
      
      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          setTests(prev => ({
            ...prev,
            table: { status: 'error', message: 'La tabla customers no existe. Ejecuta el SQL en Supabase.' }
          }))
          addLog('Tabla customers no existe')
        } else {
          setTests(prev => ({
            ...prev,
            table: { status: 'warning', message: `Acceso a tabla: ${error.message}` }
          }))
          addLog(`Error de acceso: ${error.message}`)
        }
      } else {
        setTests(prev => ({
          ...prev,
          table: { status: 'success', message: `Tabla customers existe (${data.length} filas)` }
        }))
        addLog('Tabla customers accesible')
      }
    } catch (err) {
      setTests(prev => ({
        ...prev,
        table: { status: 'error', message: `Error: ${err.message}` }
      }))
      addLog(`Error de tabla: ${err.message}`)
    }
  }

  const getIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={24} className="text-emerald-400" />
      case 'error': return <XCircle size={24} className="text-red-400" />
      case 'warning': return <AlertCircle size={24} className="text-yellow-400" />
      default: return <div className="w-6 h-6 border-2 border-pure-gray-600 border-t-pure-white rounded-full animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Diagnóstico de Supabase</h1>
          <p className="text-pure-gray-400">Verificando la conexión con la base de datos</p>
        </div>

        <div className="space-y-4 mb-8">
          {Object.entries(tests).map(([key, test]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border ${
                test.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                test.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                test.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-pure-gray-800/50 border-pure-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(test.status)}
                <div>
                  <h3 className="font-semibold capitalize mb-1">{key}</h3>
                  <p className="text-sm text-pure-gray-400">{test.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={runTests}
          className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all mb-8"
        >
          Ejecutar tests nuevamente
        </button>

        <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
          <h3 className="text-sm uppercase tracking-wider text-pure-gray-500 mb-3">Logs</h3>
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, i) => (
              <p key={i} className="text-pure-gray-400">{log}</p>
            ))}
            {logs.length === 0 && <p className="text-pure-gray-600 italic">Esperando...</p>}
          </div>
        </div>

        <div className="mt-8 p-4 bg-pure-gray-800/50 rounded-xl text-sm">
          <h3 className="font-semibold mb-2">Si hay errores:</h3>
          <ol className="list-decimal list-inside space-y-1 text-pure-gray-400">
            <li>Verifica que el SQL del esquema se ejecutó correctamente en Supabase</li>
            <li>Revisa que las credenciales URL y ANON_KEY sean correctas</li>
            <li>Verifica que las políticas RLS estén configuradas</li>
            <li>Revisa la consola del navegador (F12) para más detalles</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
