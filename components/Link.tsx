import React from 'react';
import { Link as NextIntlLink } from '@/next_utils/i18n/navigation';
import NextLink from 'next/link';

const defaultLinkStyle = {
    color: 'inherit',
    textDecoration: 'none'
}

export const NoPrefetchLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextIntlLink {...props} ref={ ref } prefetch={props.prefetch ?? false} style={defaultLinkStyle}/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';

export const UnlocalizedLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextLink {...props} ref={ ref } prefetch={props.prefetch ?? false} style={defaultLinkStyle}/>
)
UnlocalizedLink.displayName = 'UnlocalizedLink';

type TextLinkProps = {
    href: string,
    children: React.ReactNode,
    locale?: string
}

export function TextLink({ href, children, locale }: TextLinkProps) {
    return (
        <NoPrefetchLink href={ href } locale={ locale } style={defaultLinkStyle}>
            { children }
        </NoPrefetchLink>
    )
}
