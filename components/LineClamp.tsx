const LINE_CLAMP_STYLE: React.CSSProperties = {
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    overflow: 'hidden',
}

export function LineClampSpan(props: { children: React.ReactNode, lines: number, style?: React.CSSProperties }) {
    const { children, lines, style } = props;
    return (
        <span style={{ ...LINE_CLAMP_STYLE, WebkitLineClamp: lines, ...style }}>
            { children } 
        </span>
    )
}