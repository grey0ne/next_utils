import { Button, Tab, Tabs, Stack, Box, Typography } from '@mui/material';
import { Locale } from "next-intl";
import { AVAILABLE_LOCALES } from '@/next_utils/constants';
import { ENABLED_LOCALES } from './../../constants';

type LocaleTabsProps = {
    selectedLocale: Locale,
    setLocale: (locale: Locale) => void,
    title?: string,
    translateHandler?: () => void
}

export function LocaleTabs({ selectedLocale, setLocale, title, translateHandler }: LocaleTabsProps) {
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setLocale(newValue as Locale);
    };

    const tabElems = AVAILABLE_LOCALES.map((locale) => {
        if (!ENABLED_LOCALES.includes(locale.code)) return null;
        return (
            <Tab
                key={locale.code}
                label={locale.shortLabel}
                value={locale.code}
            />
        )
    })
        
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'end', justifyContent: 'space-between' }}>
            { title && <Box p={1}><Typography variant='h6'>{ title }</Typography></Box> }
            { translateHandler && (
                <Button variant="contained" color="primary" onClick={ translateHandler }>
                    Translate
                </Button>
            )}
            <Tabs
                value={ selectedLocale }
                textColor="primary"
                indicatorColor="primary"
                onChange={ handleChange }
            >
                {tabElems}
            </Tabs>
        </Stack>
    )
}