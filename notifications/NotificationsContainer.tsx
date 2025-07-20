'use client';
import { Alert, Stack } from '@mui/material';
import { useNotifications } from '@/next_utils/notifications/NotificationsContext';
import { useEffect, useState } from 'react';

export function NotificationsContainer() {
    const { notifications, hideNotification } = useNotifications();
    const [visibleErrors, setVisibleErrors] = useState<typeof notifications>([]);

    useEffect(() => {
        // Add new errors to visible errors
        const newErrors = notifications.filter(
            error => !visibleErrors.some(visible => visible.id === error.id)
        );
        if (newErrors.length > 0) {
            setVisibleErrors(prev => [...prev, ...newErrors]);
        }
    }, [notifications]);

    useEffect(() => {
        const timers = visibleErrors.map(error => {
            return setTimeout(() => {
                hideNotification(error.id);
                setVisibleErrors(prev => prev.filter(e => e.id !== error.id));
            }, 10000);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [visibleErrors, hideNotification]);

    return (
        <Stack
            spacing={1}
            sx={{
                bottom: 16,
                right: 16,
                zIndex: 2000,
                width: '800px',
                maxWidth: '60vw',
                position: 'absolute'
            }}
        >
            {visibleErrors.map((error) => (
                <Alert 
                    key={error.id}
                    onClose={() => {
                        hideNotification(error.id);
                        setVisibleErrors(prev => prev.filter(e => e.id !== error.id));
                    }}
                    severity="error" 
                    variant="filled"
                >
                    {error.message}
                </Alert>
            ))}
        </Stack>
    );
} 