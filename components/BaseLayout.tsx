import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';
import { Counters } from '@/next_utils/counters';
import { ErrorProvider } from "@/next_utils/notifications/NotificationsContext";


export async function BaseLayout({
    children,
    locale,
}: Readonly<{
    children: React.ReactNode;
    locale: string;
}>) {

    const GTAG_ID = process.env.NEXT_PUBLIC_GTAG;
    const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

    const messages = await getMessages();
    return (
        <html lang={ locale }>
            <head>
                <Counters gtag_id={ GTAG_ID } ym_id={ YM_ID }/>
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                        <ThemeProvider theme={theme}>
                            <ErrorProvider>
                                <CssBaseline />
                                { children }
                            </ErrorProvider>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
