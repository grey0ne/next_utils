export type LocalizedString = {
  ru?: string;
  de?: string;
  en?: string;
  es?: string;
  pt?: string;
}

export type BackendLocalizedString = LocalizedString //TODO dynamically configure Locale from backend
export type BackendLocale = keyof BackendLocalizedString