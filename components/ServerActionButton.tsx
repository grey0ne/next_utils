'use client'
import { useState } from 'react';
import { Button } from "@mui/material";
import { untypedApiRequest } from '../apiClient';

type ServerActionButtonProps = {
    url: string;
    title: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    variant?: 'contained' | 'outlined' | 'text';
};
export function ServerActionButton({
    url,
    onSuccess,
    onError,
    variant = 'contained',
    title,
}: ServerActionButtonProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const handleAction = async () => {
        setLoading(true);
        const { errors } = await untypedApiRequest(url, 'post', {});
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
        >
            {loading ? '...' : title}
        </Button>
    );
}