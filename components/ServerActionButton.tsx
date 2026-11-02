'use client'
import { useState } from 'react';
import { Button } from "@mui/material";
import { apiRequest } from '../apiClient';
import { PostPath, RequestParams } from '../apiHelpers';
import { useNotifications } from '@/next_utils/notifications/NotificationsContext';
import { ConfirmDialog } from '../modal/ConfirmDialog';

type ServerActionButtonProps<P extends PostPath> = {
    url: P;
    urlParams: RequestParams<P, 'post'>
    title: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
    size?: 'small' | 'medium' | 'large';
    /** When set, the action runs only after confirmation in a dialog */
    confirmText?: string;
    confirmTitle?: string;
};

export function ServerActionButton<P extends PostPath>({
    url,
    onSuccess,
    onError,
    variant = 'contained',
    color = 'primary',
    title,
    urlParams,
    size,
    confirmText,
    confirmTitle,
}: ServerActionButtonProps<P>) {
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
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
        <>
            <Button
                onClick={confirmText ? () => setConfirmOpen(true) : handleAction}
                disabled={loading}
                variant={variant}
                color={color}
                size={size}
            >
                {loading ? '...' : title}
            </Button>
            {confirmOpen && confirmText && (
                <ConfirmDialog
                    text={confirmText}
                    title={confirmTitle}
                    confirmLabel={title}
                    confirmColor={color}
                    onConfirm={handleAction}
                    onClose={() => setConfirmOpen(false)}
                />
            )}
        </>
    );
}