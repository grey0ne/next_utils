import { BackendLocalizedString, BackendLocale } from './types';
import { Locale } from 'next-intl';
import { ENABLED_LOCALES } from '../constants';

const PROJECT_DOMAIN = process.env.PROJECT_DOMAIN

export function convertBase64(blob: Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
  
        fileReader.onload = () => {
            if (fileReader.result === null) {
                reject(new Error("FileReader result is null"));
                return;
            }
            resolve(fileReader.result);
        };
  
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function hashCode(data: object) {
    const dataString = JSON.stringify(data);
    let hash = 0;
    let i, chr;
    if (dataString.length === 0) return hash;
    for (i = 0; i < dataString.length; i++) {
        chr = dataString.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function renderLocalizedString(
    value: string | BackendLocalizedString | null | undefined,
    locale: Locale
): string {
    if (!value) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object') {
        return value[locale as BackendLocale] || `No translation to "${locale}"`;
    }
    return '';
}


export function generateMetadataAlternates(url: string) {
    const languages: any = {};
    for (const locale of ENABLED_LOCALES) {
        languages[locale] = `https://${PROJECT_DOMAIN}/${locale}${url}`;
    }
    return {
        canonical: `https://${PROJECT_DOMAIN}${url}`,
        languages: languages
    }
}

export function formatDate(dateString?: string | null, locale?: BackendLocale) {
    if (!dateString) {
        return '';
    }
    return new Date(dateString).toLocaleDateString(locale || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });
};

