import React from 'react';
import { Link as NextIntlLink } from '@/next_utils/i18n/navigation';
import NextLink from 'next/link';

const defaultLinkStyle = {
    color: 'inherit',
    textDecoration: 'none'
}



export const NoPrefetchLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextIntlLink {...props} ref={ ref } prefetch={props.prefetch ?? false} style={ { ...defaultLinkStyle, ...props.style } }/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';

export const UnlocalizedLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextLink {...props} ref={ ref } prefetch={props.prefetch ?? false} style={{ ...defaultLinkStyle, ...props.style }}/>
)
UnlocalizedLink.displayName = 'UnlocalizedLink';

type TextLinkProps = {
    href: string,
    children: React.ReactNode,
    locale?: string,
    style?: React.CSSProperties
}

export function TextLink({ href, children, locale, style }: TextLinkProps) {
    return (
        <NoPrefetchLink href={ href } locale={ locale } style={{ ...defaultLinkStyle, ...style }}>
            { children }
        </NoPrefetchLink>
    )
}
