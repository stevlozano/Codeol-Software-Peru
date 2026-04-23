import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const MIN_PRICE = 300

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('codeol-cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('codeol-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item, customPrice = null) => {
    // If customPrice is provided, ensure it's at least MIN_PRICE
    const finalPrice = customPrice ? Math.max(MIN_PRICE, customPrice) : null
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { 
            ...i, 
            quantity: i.quantity + 1,
            customPrice: finalPrice || i.customPrice 
          } : i
        )
      }
      return [...prev, { ...item, quantity: 1, customPrice: finalPrice }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    )
  }

  const updateItemPrice = (id, customPrice) => {
    // Store the price as-is, will be validated on blur
    setCart(prev =>
      prev.map(item => item.id === id ? { ...item, customPrice: customPrice } : item)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => {
    const price = item.customPrice ? Math.max(MIN_PRICE, parseFloat(item.customPrice) || MIN_PRICE) : (item.price === 'Cotizar' ? 0 : parseFloat(item.price.replace(/[^0-9]/g, '')))
    return sum + (price * item.quantity)
  }, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemPrice,
      clearCart,
      totalItems,
      totalPrice,
      MIN_PRICE,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
