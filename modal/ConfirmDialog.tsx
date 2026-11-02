'use client'
import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslations } from 'next-intl';
import { StyledModal } from './StyledModal';

export type ConfirmColor = 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';

export type ConfirmDialogProps = {
    text: string;
    title?: string;
    confirmLabel?: string;
    confirmColor?: ConfirmColor;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
};

/**
 * Replacement for window.confirm: the action runs on confirmation, the dialog stays open
 * (buttons disabled) until it finishes
 */
export function ConfirmDialog({
    text, title, confirmLabel, confirmColor = 'primary', onConfirm, onClose,
}: ConfirmDialogProps) {
    const t = useTranslations('confirm_dialog');
    const [loading, setLoading] = useState(false);

    const confirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <StyledModal onClose={loading ? undefined : onClose} maxWidth="xs" fullscreenBreakpoint={false}>
            <DialogTitle>{title || t('title')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ whiteSpace: 'pre-line' }}>{text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>{t('cancel')}</Button>
                <Button onClick={confirm} disabled={loading} variant="contained" color={confirmColor} autoFocus>
                    {confirmLabel || t('confirm')}
                </Button>
            </DialogActions>
        </StyledModal>
    );
}
