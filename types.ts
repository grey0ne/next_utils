import { components } from '@/api/apiTypes';

export type BackendLocalizedString = components['schemas']['LocalizedStringSchema']
export type LocalizedString = components['schemas']['LocalizedStringSchema']
export type BackendLocale = keyof BackendLocalizedString