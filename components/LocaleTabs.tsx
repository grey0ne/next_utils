import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Locale } from "next-intl";
import { Stack, Box, Typography } from '@mui/material';
import { AVAILABLE_LOCALES } from '@/next_utils/constants';
import { ENABLED_LOCALES } from './../../constants';

type LocaleTabsProps = {
    selectedLocale: Locale,
    setLocale: (locale: Locale) => void,
    title?: string,
}

export function LocaleTabs({ selectedLocale, setLocale, title }: LocaleTabsProps) {
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