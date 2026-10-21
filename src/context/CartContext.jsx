import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'jan-cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      if (item.licenseId === 'exclusive' && prev.some((x) => x.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((x) => x.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    count: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
