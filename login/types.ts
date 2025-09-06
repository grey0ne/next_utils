
export interface TelegramLoginProps {
    botUsername: string;
    onSuccess?: (data: any) => void;
}

export interface YandexLoginProps {
    domain: string;
    onSuccess?: (data: any) => void;
    clientId?: string;
};


export enum AuthProviderType {
    YANDEX_JS = 'yandex_js',
    YANDEX_REDIRECT = 'yandex_redirect',
    TELEGRAM = 'telegram',
}

export interface YandexLoginParams extends YandexLoginProps {
    providerType: AuthProviderType.YANDEX_JS;
}
export interface TelegramLoginParams extends TelegramLoginProps {
    providerType: AuthProviderType.TELEGRAM;
}
export interface YandexRedirectLoginParams {
    providerType: AuthProviderType.YANDEX_REDIRECT;
}

export type AuthProviderParams = YandexLoginParams | TelegramLoginParams | YandexRedirectLoginParams;

