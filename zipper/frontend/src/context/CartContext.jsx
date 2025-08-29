// In frontend/src/context/CartContext.jsx (UPGRADED)
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useNotification } from './NotificationContext'; // 1. Import the notification hook

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { addNotification } = useNotification(); // 2. Get the addNotification function

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('proshop-cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('proshop-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) } // Handle explicit quantity
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
    // 3. Trigger a notification
    addNotification('Item added to cart!');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Calculate the total number of items for the header icon
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount, // 5. Expose the item count
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}