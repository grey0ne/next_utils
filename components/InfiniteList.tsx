'use client'
import { useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { usePaginatedApi } from '@/next_utils/apiClient';
import { Path, RequestPathParams, PaginatedResponseTypeItems } from '@/next_utils/apiHelpers';

const DEFAULT_PER_PAGE = 20;

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

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loadMoreRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isLoading) {
                        setSize(size + 1);
                    }
                },
                { threshold: 0.1 }
            );
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isLoading, size, setSize]);

    if (error) {
        return (
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography color="error">Error</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            { renderItems(items) }
            <div ref={loadMoreRef} style={{ height: '20px' }} />
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
}