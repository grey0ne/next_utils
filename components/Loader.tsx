'use client'
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';


export function Loader({ isLoading }: { isLoading: boolean}) {
    const t = useTranslations('loader');
    if (!isLoading) {
        return null;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography>{t('loading')}</Typography>
        </Box>
    );
}