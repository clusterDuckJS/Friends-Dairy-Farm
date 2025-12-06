import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "rawstack_cart_v1";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Cart parse failed", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...product, qty }];
    });
  }

  function setQty(productId, qty) {
    setItems(prev => prev.map(i => (i.id === productId ? { ...i, qty } : i)));
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(() => items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, setQty, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
