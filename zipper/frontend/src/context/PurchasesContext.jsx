// frontend/src/context/PurchasesContext.jsx
'use client';

// 1. Import useEffect
import { createContext, useContext, useState, useEffect } from 'react';

const PurchasesContext = createContext();

export function usePurchases() {
  return useContext(PurchasesContext);
}

export function PurchasesProvider({ children }) {
  const [purchases, setPurchases] = useState([]);

  // 2. Load purchases from localStorage on initial render
  useEffect(() => {
    const storedPurchases = localStorage.getItem('proshop-purchases');
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    }
  }, []); // Empty dependency array ensures this runs only once when the app loads

  // 3. Save purchases to localStorage whenever the purchases state changes
  useEffect(() => {
    localStorage.setItem('proshop-purchases', JSON.stringify(purchases));
  }, [purchases]); // This effect runs every time the 'purchases' array is modified

  const addPurchase = (purchaseDetails) => {
    const newPurchase = {
      ...purchaseDetails,
      createdAt: new Date().toISOString(),
    };

    // This will now trigger the save-to-localStorage effect
    setPurchases(prevPurchases => [newPurchase, ...prevPurchases]);
  };

  const value = {
    purchases,
    addPurchase,
  };

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
}