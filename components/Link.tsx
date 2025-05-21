import React from 'react';
import { Link as NextLink } from '@/i18n/navigation';

export const NoPrefetchLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <NextLink {...props} ref={ ref } prefetch={props.prefetch ?? false}/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';
