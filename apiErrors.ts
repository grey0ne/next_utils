'use client'
import { useTranslations } from 'next-intl';

type ErrorParams = Record<string, string | number>;

type ApiErrorBody = {
    code?: string,
    detail?: unknown,
    params?: ErrorParams,
};

/** Keys are built at runtime, so the typed next-intl translator is used through this narrow interface */
type Translator = {
    (key: string, values?: ErrorParams): string,
    has: (key: string) => boolean,
};

/** Statuses with a common message in ApiErrorsCommon; other 4xx without a code show the backend detail */
const STATUS_KEYS: Record<number, string> = {
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not_found',
    413: 'too_large',
    422: 'validation',
    429: 'too_many_requests',
};

/**
 * Translated message for an API error (an item of `errors` from apiRequest/apiPost, or a parsed error body):
 * 1. `ApiErrors.<code>` from the project messages for errors with a code (django_utils ApiError), with its params
 * 2. a common message by the status from `ApiErrorsCommon` (next_utils messages)
 * 3. the backend `detail` text, for errors that have no code yet
 */
export function useFormatApiError(): (error: unknown, status?: number) => string {
    const t = useTranslations() as unknown as Translator;
    return (error: unknown, status?: number) => {
        const body: ApiErrorBody = error && typeof error === 'object' ? error as ApiErrorBody : {};
        const codeKey = `ApiErrors.${body.code}`;
        if (body.code && t.has(codeKey)) {
            return t(codeKey, body.params);
        }
        if (status !== undefined && status >= 500) {
            return t('ApiErrorsCommon.server_error');
        }
        const statusKey = status !== undefined ? STATUS_KEYS[status] : undefined;
        if (statusKey) {
            return t(`ApiErrorsCommon.${statusKey}`);
        }
        if (typeof body.detail === 'string' && body.detail) {
            return body.detail;
        }
        if (typeof error === 'string' && error) {
            return error;
        }
        return t('ApiErrorsCommon.request_failed');
    };
}
