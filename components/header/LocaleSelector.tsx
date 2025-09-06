'use client'
import { TextLink } from "@/next_utils/components/Link"
import { Box, Button, MenuItem, Popover } from "@mui/material"
import { usePathname } from '@/next_utils/i18n/navigation';
import { useLocale } from "next-intl";
import { useState } from "react";
import { AVAILABLE_LOCALES } from "@/next_utils/constants"; 
import { ENABLED_LOCALES } from "../../../constants";
import Image from "next/image"

export function LocaleSelector() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const url = usePathname();
    const locale = useLocale();

    const filteredLocales = AVAILABLE_LOCALES.filter(l => ENABLED_LOCALES.includes(l.code));

    return (
        <>
            <Button variant="text" color="inherit" onClick={handleClick}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Image
                        src={filteredLocales.find(l => l.code === locale)?.flag}
                        alt={locale}
                        width={20}
                        height={15}
                        style={{ objectFit: 'contain' }}
                    />
                    {filteredLocales.find(l => l.code === locale)?.shortLabel}
                </Box>
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {filteredLocales.map((locale) => (
                    <MenuItem key={locale.code} value={locale.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Image
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
            </Popover>
        </>
    );
}
