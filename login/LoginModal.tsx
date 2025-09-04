'use client'
import { useState } from 'react'
import { StyledModal } from '../modal/StyledModal'
import { Box, Typography } from '@mui/material'
import { TelegramLogin } from './TelegramLogin'


export type AuthProvider = 'telegram' | 'yandex' | 'google';

type LoginModalProps = {
    onClose?: () => void;
    modalTitle?: string;
    enabledProviders?: AuthProvider[];
}

export function LoginModal({ onClose, modalTitle, enabledProviders = [] }: LoginModalProps) {
    const buttonElems = [];
    if (enabledProviders.includes('telegram')) {
        buttonElems.push(<TelegramLogin botUsername="samplebot" onSuccess={() => {}} />)
    }
    return (
        <StyledModal onClose={onClose} maxWidth="sm" fullscreenBreakpoint={false}>
            <Box p={2}>
                <Typography variant="h6">{ modalTitle || 'Login' }</Typography>
                { buttonElems }
            </Box>
        </StyledModal>
    )
}

const DefaultButtonComponent = ({ onClick }: { onClick: () => void }) => {
    return <Typography variant="body1" onClick={onClick} sx={{ cursor: 'pointer' }}>Login</Typography>
}

type LoginModalButtonProps = LoginModalProps & {
    buttonComponent?: React.ComponentType<{ onClick: () => void }>;

}
export function LoginModalButton({ modalTitle, buttonComponent: ButtonComponent, enabledProviders = [] }: LoginModalButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const clickHandler = () => { setShowModal(true) }
    const buttonElement = ButtonComponent ? <ButtonComponent onClick={clickHandler} /> : <DefaultButtonComponent onClick={clickHandler} />
    return (
        <>
            { buttonElement }
            { showModal && <LoginModal onClose={() => setShowModal(false)} enabledProviders={enabledProviders} modalTitle={modalTitle} /> }
        </>
    )
}