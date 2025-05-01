export enum Locale {
    EN = 'en',
    RU = 'ru',
}

export type LocalizedString = { [key in Locale]: string }