"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist items from local storage
  useEffect(() => {
    const loadWishlistItems = () => {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist).map(item => ({ ...item, showMore: false })));
      }
    };

    loadWishlistItems(); // Initial load for wishlist items

    const handleStorageChange = (event) => {
      if (event.key === 'wishlist') {
        loadWishlistItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update wishlist items in local storage
  const updateWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event('storage')); // Manually trigger storage event
  };

  // Wishlist functions
  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((wishItem) => wishItem.id === item.id);
      if (!exists) {
        const updatedWishlist = [...prevItems, item];
        updateWishlist(updatedWishlist); 
        return updatedWishlist;
      }
      return prevItems;
    });
  };
  

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    updateWishlist(updatedWishlist);
  };

  const toggleShowMore = (id) => {
    setWishlistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, showMore: !item.showMore } : item
      )
    );
  };

  // Calculate wishlist count
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleShowMore,
      wishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
