'use client'
import { useState } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { ConfirmDialog, ConfirmDialogProps } from '../modal/ConfirmDialog';

type ConfirmButtonProps = Omit<ButtonProps, 'onClick'> & Pick<ConfirmDialogProps, 'onConfirm'> & {
    confirmText: string;
    confirmTitle?: string;
    confirmLabel?: string;
};

/** Button that asks for confirmation in a dialog before running the action */
export function ConfirmButton({
    confirmText, confirmTitle, confirmLabel, onConfirm, color, children, ...buttonProps
}: ConfirmButtonProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button {...buttonProps} color={color} onClick={() => setOpen(true)}>{children}</Button>
            {open && (
                <ConfirmDialog
                    text={confirmText}
                    title={confirmTitle}
                    confirmLabel={confirmLabel || (typeof children === 'string' ? children : undefined)}
                    confirmColor={color === 'inherit' ? undefined : color}
                    onConfirm={onConfirm}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
