'use client'
import { useState } from 'react';
import { Button } from "@mui/material";
import { apiRequest } from '../apiClient';
import { PostPath, RequestParams } from '../apiHelpers';
import { useNotifications } from '@/next_utils/notifications/NotificationsContext';

type ServerActionButtonProps<P extends PostPath> = {
    url: P;
    urlParams: RequestParams<P, 'post'>
    title: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
};

export function ServerActionButton<P extends PostPath>({
    url,
    onSuccess,
    onError,
    variant = 'contained',
    color = 'primary',
    title,
    urlParams,
}: ServerActionButtonProps<P>) {
    const [loading, setLoading] = useState<boolean>(false);
    const { showNotification } = useNotifications();

    const handleAction = async () => {
        setLoading(true);
        const { errors } = await apiRequest(url, 'post', {}, urlParams);
        setLoading(false);
        if (errors.length > 0) {
            const errorMessage = errors[0]['detail'];
            showNotification(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
        } else {
            if (onSuccess) {
                onSuccess();
            }
        }
    }
 
    return (
        <Button
            onClick={handleAction}
            disabled={loading}
            variant={variant}
            color={color}
        >
            {loading ? '...' : title}
        </Button>
    );
}