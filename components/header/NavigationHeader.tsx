'use client'
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NoPrefetchLink, UnlocalizedLink } from '@/next_utils/components/Link';
import { LocaleSelector } from '@/next_utils/components/header/LocaleSelector';
import { useUserDataFromCookie, UserState } from '@/next_utils/userDataClient';
import { components } from '@/api/apiTypes';
import { LoginModalButton } from '@/next_utils/login/LoginModal';
import { AuthProviderParams } from '@/next_utils/login/types';
import { LogoutButton } from '@/next_utils/components/header/LogoutButton';
import { UserElement } from '@/next_utils/components/header/UserElement';
import { BackendLocale } from '@/next_utils/types';
import { useTranslations } from 'next-intl';


type CurrentUserData = components['schemas']['CurrentUserData']['user'];

type HeaderLink = {
    url: string;
    label: string;
    external?: boolean;
    needAuth?: boolean;
    needAdmin?: boolean;
}

type NavigationHeaderProps = {
    title: string;
    links: HeaderLink[];
    showDjangoAdmin?: boolean;
    showUser?: boolean;
    showLogout?: boolean;
    authProviders?: AuthProviderParams[];
    headerColor?: 'primary' | 'secondary';
    locale: BackendLocale;
}

const LINK_STYLE = { color: 'inherit', textDecoration: 'none' };


function LinkElem({ link, currentUser }: { link: HeaderLink, currentUser?: CurrentUserData | null }) {
    if (link.needAuth && !currentUser) return null;
    if (link.needAdmin && !currentUser?.is_superuser) return null;
    if (link.external) {
        return (
            <UnlocalizedLink href={link.url} style={LINK_STYLE} key={link.label}>
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
}

export function NavigationHeader({
    title, links, showDjangoAdmin, showUser,
    authProviders, headerColor = 'secondary', showLogout, 
    locale
}: NavigationHeaderProps) {
    const { userData, userState } = useUserDataFromCookie();
    const isAuthenticated = userState === UserState.AUTHENTICATED;
    const isLoading = userState === UserState.LOADING;
    const t = useTranslations('NavigationHeader');

    const linkElems = links.map((link) => <LinkElem link={link} currentUser={userData} key={link.label} />)

    return (
        <AppBar position="static" color={headerColor}>
            <Toolbar sx={{ maxWidth: 1200, margin: "0 auto", width: "100%"}}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <NoPrefetchLink href="/" style={LINK_STYLE}>
                        { title }
                    </NoPrefetchLink>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {linkElems}
                    { showDjangoAdmin && isAuthenticated && (
                        <UnlocalizedLink href="/admin/" style={LINK_STYLE}>
                            {t('django_admin')}
                        </UnlocalizedLink>
                    )}

                    { showUser && isAuthenticated && <UserElement /> }
                    {!isAuthenticated && !isLoading && <LoginModalButton enabledProviders={authProviders} />}
                    <LocaleSelector locale={locale} />
                    { showLogout && isAuthenticated && !isLoading && <LogoutButton /> }
                </Box>
            </Toolbar>
        </AppBar>
    );
} 