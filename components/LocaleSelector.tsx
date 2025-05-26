'use client'
import { TextLink } from "@/next_utils/components/Link"
import { Box, Typography } from "@mui/material"
import { usePathname } from '@/next_utils/i18n/navigation';


export function LocaleSelector () {
    const url = usePathname();
    return (
        <Box>
            <Typography variant='h6'>
                <TextLink href={ url } locale='ru'>
                    Рус
                </TextLink>
                /
                <TextLink href={ url } locale='en'>
                    Eng
                </TextLink>
            </Typography>
        </Box>
    )
}