// context/LikesContext.js
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const LikesContext = createContext();

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used within LikesProvider');
  return ctx;
}

export function LikesProvider({ children }) {
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // 1. Fetch initial liked items from the backend on app load.
  // This is now the single source of truth when the app starts.
  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/liked`);
        if (!res.ok) throw new Error("Failed to fetch initial likes");
        const likedItems = await res.json();
        // Store the IDs in our Set for efficient lookups
        setLikedIds(new Set(likedItems.map(item => item.id)));
      } catch (error) {
        console.error("Error fetching initial likes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialLikes();
  }, []);

  // 2. The core function to like or unlike an item.
  const toggleLike = useCallback(async (productId) => {
    // Optimistic UI Update: Update the state immediately for a fast user experience.
    const isCurrentlyLiked = likedIds.has(productId);
    
    // Create a new set to trigger re-render
    const newLikedIds = new Set(likedIds);
    if (isCurrentlyLiked) {
      newLikedIds.delete(productId);
    } else {
      newLikedIds.add(productId);
    }
    setLikedIds(newLikedIds);

    // API Call to Persist Change: Update the backend.
    const endpoint = isCurrentlyLiked 
      ? `${API_BASE}/api/products/${productId}/unlike` 
      : `${API_BASE}/api/products/${productId}/like`;
    const method = isCurrentlyLiked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, { method });
      if (!response.ok) {
        throw new Error("API call failed"); // This will be caught below
      }
      console.log(`Successfully ${isCurrentlyLiked ? 'unliked' : 'liked'} product ${productId} on the server.`);
    } catch (error) {
      console.error("Failed to toggle like on backend:", error);
      // If the API call fails, revert the optimistic UI update to keep the state consistent.
      setLikedIds(prevIds => {
        const revertedIds = new Set(prevIds);
        if (isCurrentlyLiked) {
          revertedIds.add(productId); // It failed to delete, so add it back.
        } else {
          revertedIds.delete(productId); // It failed to add, so remove it.
        }
        return revertedIds;
      });
      // Optionally, show an error toast to the user here.
    }
  }, [likedIds]);

  const isLiked = useCallback((productId) => {
    return likedIds.has(productId);
  }, [likedIds]);

  const value = {
    likedIds,
    toggleLike,
    isLiked,
    loadingLikes: loading,
  };

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}