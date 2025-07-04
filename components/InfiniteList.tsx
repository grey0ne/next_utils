'use client'
import { useInView } from 'react-intersection-observer';
import { Box, Typography, Paper, CircularProgress, Stack } from '@mui/material';
import { usePaginatedApi } from '@/next_utils/apiClient';
import { Path, RequestPathParams, PaginatedResponseTypeItems } from '@/next_utils/apiHelpers';

const DEFAULT_PER_PAGE = 20;

export function ControlledInfiniteList<ItemType>(props: {
    items: ItemType[],
    size: number,
    setSize: (size: number) => void,
    renderItems: (items: ItemType[]) => React.ReactNode,
    error?: string,
    isLoading?: boolean,
}) {
    const { items, size, setSize, error, isLoading, renderItems } = props;
    const { ref } = useInView({
        onChange: ( inView ) => { 
            if (inView) { setSize(size + 1) }
        },
        threshold: 0,
        skip: items.length === 0
    });

    if (error) {
        return (
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography color="error">Error</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Stack spacing={1}>
                { renderItems(items) }
            </Stack>
            <div ref={ref} style={{ height: '20px' }} />
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
}

export function InfiniteList<P extends Path>(props: {
    url: P,
    pathParams: RequestPathParams<P, 'get'> extends undefined ? {} : RequestPathParams<P, 'get'>
    renderItems: (items: PaginatedResponseTypeItems<P, 'get'>) => React.ReactNode,
    perPage?: number,
 }) {
    const { url, pathParams, renderItems, perPage } = props;
    const { items, error, isLoading, size, setSize } = usePaginatedApi(
        url, { path: pathParams, query: { per_page: perPage || DEFAULT_PER_PAGE } }
    );

    return <ControlledInfiniteList
        items={items}
        size={size}
        setSize={setSize}
        renderItems={renderItems}
        error={error}
        isLoading={isLoading}
    />
}