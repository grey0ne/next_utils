import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NoPrefetchLink, UnlocalizedLink } from '@/next_utils/components/Link';
import { apiGet } from '@/next_utils/apiServer';
import { getTranslations } from 'next-intl/server';
import { LocaleSelector } from '@/next_utils/components/LocaleSelector';

type HeaderLink = {
    url: string;
    label: string;
    external?: boolean;
    needAuth?: boolean;
}

type NavigationHeaderProps = {
    title: string;
    links: HeaderLink[];
    showAdmin?: boolean;
    showUser?: boolean;
}

const LINK_STYLE = { color: 'inherit', textDecoration: 'none' };

export async function NavigationHeader({ title, links, showAdmin, showUser }: NavigationHeaderProps) {
    const { data: currentUserData } = await apiGet('/api/users/current_user', {});
    const currentUser = currentUserData?.user
    const t = await getTranslations('NavigationHeader');

    const linkElems = links.map((link) => {
        if (link.needAuth && !currentUser) return null;
        if (link.external) {
            return (
                <UnlocalizedLink href="/admin/" style={LINK_STYLE} key={link.label}>
                    {link.label}
                </UnlocalizedLink>
            )
        } else {
            return (
                <NoPrefetchLink href={link.url} style={LINK_STYLE} key={link.label}>
                    {link.label}
                </NoPrefetchLink>
            )
        }
    })

    return (
        <AppBar position="static" color='secondary'>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <NoPrefetchLink href="/" style={LINK_STYLE}>
                        { title }
                    </NoPrefetchLink>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {linkElems}
                    { showAdmin && currentUser && (
                        <UnlocalizedLink href="/admin/" style={LINK_STYLE}>
                            {t('admin')}
                        </UnlocalizedLink>
                    )}

                    { showUser && currentUser && (
                        <Typography variant="body1">
                            {currentUser.username}
                        </Typography>
                    )}
                    <LocaleSelector />
                    {!currentUser && (
                        <UnlocalizedLink href="/login/yandex-oauth2/" style={LINK_STYLE}>
                            {t('login')}
                        </UnlocalizedLink>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
} 