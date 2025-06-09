'use client'
import { useState } from 'react';
import { Button } from "@mui/material";
import { apiRequest } from '../apiClient';
import { PostPath, RequestParams } from '../apiHelpers';

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
    const handleAction = async () => {
        setLoading(true);
        const { errors } = await apiRequest(url, 'post', {}, urlParams);
        setLoading(false);
        if (errors.length > 0) {
            if (onError) {
                onError(errors[0]['detail']);
            } else {
                console.error(errors[0]['detail']);
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
            disabled={ loading }
            variant={variant}
            color={color}
        >
            {loading ? '...' : title}
        </Button>
    );
}