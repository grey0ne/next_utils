import { defineRouting } from 'next-intl/routing';
import { ENABLED_LOCALES } from '@/constants';
 
export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ENABLED_LOCALES,
 
    // Used when no locale matches
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});
 