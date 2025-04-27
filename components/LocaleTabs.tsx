import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Locale } from "@/app/types";
import { Stack, Box } from '@mui/material';

type LocaleTabsProps = {
    selectedLocale: Locale,
    setLocale: (locale: Locale) => void,
    title?: string,
}

export function LocaleTabs({ selectedLocale, setLocale, title }: LocaleTabsProps) {
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setLocale(newValue as Locale);
    };
        
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            { title && <Box>{ title }</Box> }
            <Tabs
                value={ selectedLocale }
                textColor="primary"
                indicatorColor="primary"
                onChange={ handleChange }
            >
                <Tab label={ Locale.EN } value={ Locale.EN } />
                <Tab label={ Locale.RU } value={ Locale.RU } />
            </Tabs>
        </Stack>
    )
}