'use client'
import { untypedApiRequest } from '@/next_utils/apiClient';

const LINK_STYLE = { color: 'inherit', textDecoration: 'none' };

export function LogoutButton({ text }: { text: string }) {
    return (
        <a href='/api/auth/logout' style={LINK_STYLE} onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            untypedApiRequest('/api/auth/logout', 'post', {}).then(() => {
                window.location.reload();
            })
        }}>
            {text}
        </a>
    )
}

