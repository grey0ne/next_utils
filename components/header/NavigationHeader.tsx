import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NoPrefetchLink, UnlocalizedLink } from '@/next_utils/components/Link';
import { getTranslations } from 'next-intl/server';
import { LocaleSelector } from '@/next_utils/components/header/LocaleSelector';
import { getUserDataFromCookie } from '@/next_utils/userDataServer';
import { components } from '@/api/apiTypes';
import { LoginModalButton } from '@/next_utils/login/LoginModal';
import { AuthProviderParams } from '@/next_utils/login/types';
import { LogoutButton } from '@/next_utils/components/header/LogoutButton';
import { UserElement } from '@/next_utils/components/header/UserElement';


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

export async function NavigationHeader({
    title, links, showDjangoAdmin, showUser,
    authProviders, headerColor = 'secondary', showLogout
}: NavigationHeaderProps) {
    const currentUser = await getUserDataFromCookie();
    const t = await getTranslations('NavigationHeader');

    const linkElems = links.map((link) => <LinkElem link={link} currentUser={currentUser} key={link.label} />)

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
                    { showDjangoAdmin && currentUser && (
                        <UnlocalizedLink href="/admin/" style={LINK_STYLE}>
                            {t('django_admin')}
                        </UnlocalizedLink>
                    )}

                    { showUser && <UserElement /> }
                    {!currentUser && <LoginModalButton enabledProviders={authProviders} />}
                    <LocaleSelector />
                    { showLogout && currentUser && <LogoutButton /> }
                </Box>
            </Toolbar>
        </AppBar>
    );
} 