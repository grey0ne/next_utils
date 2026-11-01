'use client'
import { untypedApiRequest } from '@/next_utils/apiClient';
import { ExitToApp } from '@mui/icons-material';

const LINK_STYLE = { color: 'inherit', textDecoration: 'none' };

export function LogoutButton() {
    return (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href='/api/auth/logout' style={LINK_STYLE} onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            untypedApiRequest('/api/auth/logout', 'post', {}).then(() => {
                window.location.reload();
            })
        }}>
            <ExitToApp />
        </a>
    )
}

