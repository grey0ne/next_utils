'use client'
import { TextLink } from "@/next_utils/components/Link"
import { Box, Select, MenuItem } from "@mui/material"
import { usePathname } from '@/next_utils/i18n/navigation';
import { useLocale } from "next-intl";
import { AVAILABLE_LOCALES } from "@/next_utils/constants"; 
import { ENABLED_LOCALES } from "./../../constants";

export function LocaleSelector() {
    const url = usePathname();
    const locale = useLocale();

    const filteredLocales = AVAILABLE_LOCALES.filter(l => ENABLED_LOCALES.includes(l.code));

    return (
        <Select
            value={locale}
            sx={{ color: 'inherit' }}
            IconComponent={() => null} // Hide default icon
            variant="outlined"
        >
            {filteredLocales.map((locale) => (
                <MenuItem key={locale.code} value={locale.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            component='img'
                            src={locale.flag}
                            alt={locale.label}
                            width={20}
                            height={15}
                            style={{ objectFit: 'contain' }}
                        />
                        <TextLink href={ url } locale={locale.code }>
                            {locale.label}
                        </TextLink>
                    </Box>
                </MenuItem>
            ))}
        </Select>
    );
}