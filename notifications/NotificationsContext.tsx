'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type NotificationData = {
    id: string;
    message: string;
    timestamp: number;
};

type NotificationContextType = {
    showNotification: (message: string) => void;
    hideNotification: (id: string) => void;
    notifications: NotificationData[];
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const showNotification = useCallback((message: string) => {
        const id = Math.random().toString(36).substring(7);
        const timestamp = Date.now();
        setNotifications(prev => [...prev, { id, message, timestamp }]);
    }, []);

    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(error => error.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
} 