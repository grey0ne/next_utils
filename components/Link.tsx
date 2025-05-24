import React from 'react';
import { Link as NextIntlLink } from '@/next_utils/i18n/navigation';
import NextLink from 'next/link';

export const NoPrefetchLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextIntlLink {...props} ref={ ref } prefetch={props.prefetch ?? false}/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';

export const UnlocalizedLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextLink {...props} ref={ ref } prefetch={props.prefetch ?? false}/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';
