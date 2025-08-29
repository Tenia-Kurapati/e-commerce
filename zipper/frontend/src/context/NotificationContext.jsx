// frontend/src/context/NotificationContext.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/Toaster'; // We will create this next

const NotificationContext = createContext(null);

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        // Automatically remove after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <Toaster notifications={notifications} />
        </NotificationContext.Provider>
    );
}