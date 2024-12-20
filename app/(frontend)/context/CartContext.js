'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Loads cart items from localStorage on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    };

    fetchCartItems();

    const handleStorageChange = (event) => {
      if (event.key === 'cart') {
        setCartItems(JSON.parse(event.newValue) || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper function to update cart items in state and localStorage
  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage')); // Sync across tabs
  };

  // Adds an item to the cart, or increments weight if it already exists
  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) => 
        cartItem.id === item.id 
          ? { ...cartItem, weight: item.weight } 
          : cartItem
      );
      updateCart(updatedCart);
    } else {
      const newItem = { ...item, weight: item.weight || 1 };
      updateCart([...cartItems, newItem]);
    }
  };

  // Removes an item completely from the cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  // Increments the weight of an item in the cart
  const incrementWeight = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, weight: item.weight + 1 };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  // Decrements the weight of an item in the cart
  const decrementWeight = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.weight > 1) {
        return { ...item, weight: item.weight - 1 };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  // Calculate total price and total items
  const totalPrice = cartItems.reduce((total, item) => {
    const pricePerKg = parseFloat(item.price) || 0;
    return total + (pricePerKg * item.weight);
  }, 0);

  const totalItems = cartItems.length;

  // Save total price and items count in local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkoutDetails = {
        totalPrice,
        totalItems,
      };
      localStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails));
    }
  }, [totalPrice, totalItems, cartItems]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      incrementWeight, 
      decrementWeight, 
      totalPrice, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

