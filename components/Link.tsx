import React from 'react';
import RegularLink from 'next/link';

export const NoPrefetchLink = React.forwardRef(
    (props: any, ref:React.ForwardedRef<any>) => <RegularLink {...props} ref={ ref } prefetch={props.prefetch ?? false}/>
)
NoPrefetchLink.displayName = 'NoPrefetchLink';
