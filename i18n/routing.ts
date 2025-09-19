import { defineRouting } from 'next-intl/routing';
import { ENABLED_LOCALES } from './../../constants';
 
export const routing = defineRouting({
    // A list of all locales that are supported. Typescript goes crazy if you don't cast to any[].
    locales: ENABLED_LOCALES as any[],
 
    // Used when no locale matches
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});
 