'use client'
import { useState } from 'react'
import { StyledModal } from '../modal/StyledModal'
import { Typography, Stack, Button } from '@mui/material'
import { TelegramLogin } from './TelegramLogin'
import { YandexLogin } from './YandexLogin'
import { AuthProviderParams, AuthProviderType } from './types'
import { socialAuthLogin } from './socialAuthLogin'
import { useTranslations } from 'next-intl';

type LoginModalProps = {
    onClose?: () => void;
    modalTitle?: string;
    enabledProviders?: AuthProviderParams[];
}

export function LoginModal({ onClose, modalTitle, enabledProviders = [] }: LoginModalProps) {
    const t = useTranslations('LoginModal');
    const buttonElems = [];
    for (const provider of enabledProviders) {
        if (provider.providerType === AuthProviderType.TELEGRAM) {
            buttonElems.push(<TelegramLogin {...provider} key={provider.providerType}/>)
        }
        if (provider.providerType === AuthProviderType.YANDEX_JS) {
            buttonElems.push(<YandexLogin {...provider} key={provider.providerType}/>)
        }
        if (provider.providerType === AuthProviderType.YANDEX_REDIRECT) {
            buttonElems.push(
                <Button variant="contained" color="primary" key={provider.providerType} onClick={() => socialAuthLogin('yandex-oauth2')}>
                    { t('login_yandex_caption')}
                </Button>
            )
        }
    }
    return (
        <StyledModal onClose={onClose} maxWidth="sm" fullscreenBreakpoint={false}>
            <Stack spacing={2} sx={{ p: 2, alignItems: "center" }}>
                <Typography variant="h6">{ modalTitle || t('login_modal_header') }</Typography>
                { buttonElems }
            </Stack>
        </StyledModal>
    )
}

const DefaultButtonComponent = ({ onClick, buttonText }: { onClick: () => void, buttonText: string }) => {
    return <Typography variant="body1" onClick={onClick} sx={{ cursor: 'pointer' }}>{buttonText}</Typography>
}

type LoginModalButtonProps = LoginModalProps & {
    buttonComponent?: React.ComponentType<{ onClick: () => void }>;
    buttonText?: string;
}

export function LoginModalButton({
    modalTitle, buttonComponent: ButtonComponent, enabledProviders = [], buttonText
}: LoginModalButtonProps) {
    const t = useTranslations('LoginModal');
    const authEnabled = enabledProviders && enabledProviders.length > 0;
    if (!authEnabled) {
        return null;
    }
    const [showModal, setShowModal] = useState(false)
    const clickHandler = () => { setShowModal(true) }
    const buttonElement = ButtonComponent ? <ButtonComponent onClick={clickHandler} /> : <DefaultButtonComponent onClick={clickHandler} buttonText={buttonText || t('login_modal_button_text')} />
    return (
        <>
            { buttonElement }
            { showModal && <LoginModal onClose={() => setShowModal(false)} enabledProviders={enabledProviders} modalTitle={modalTitle} /> }
        </>
    )
}