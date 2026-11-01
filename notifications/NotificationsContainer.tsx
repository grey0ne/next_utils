'use client';
import { Alert, Stack } from '@mui/material';
import { useNotifications } from '@/next_utils/notifications/NotificationsContext';
import { useEffect } from 'react';

const NOTIFICATION_TIMEOUT = 10000;

export function NotificationsContainer() {
    const { notifications, hideNotification } = useNotifications();

    useEffect(() => {
        const timers = notifications.map(error => {
            return setTimeout(() => {
                hideNotification(error.id);
            }, Math.max(0, error.timestamp + NOTIFICATION_TIMEOUT - Date.now()));
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, hideNotification]);

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
            {notifications.map((error) => (
                <Alert 
                    key={error.id}
                    onClose={() => hideNotification(error.id)}
                    severity="error" 
                    variant="filled"
                >
                    {error.message}
                </Alert>
            ))}
        </Stack>
    );
} 