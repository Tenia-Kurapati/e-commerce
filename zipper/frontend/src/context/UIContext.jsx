// frontend/src/context/UIContext.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function useUI() {
    return useContext(UIContext);
}

export function UIProvider({ children }) {
    const [isOrdersPanelOpen, setOrdersPanelOpen] = useState(false);

    const toggleOrdersPanel = useCallback(() => {
        setOrdersPanelOpen(prevState => !prevState);
    }, []);

    const closeOrdersPanel = useCallback(() => {
        setOrdersPanelOpen(false);
    }, []);

    const value = { isOrdersPanelOpen, toggleOrdersPanel, closeOrdersPanel };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}