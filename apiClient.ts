'use client'
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import {
    PaginatedResponseType, Path, PathMethod, RequestParams,
    ResponseType, generateUrl, RequestBody
} from '@/next_utils/apiHelpers';
import { getCookie } from '@/next_utils/helpers';

const DEFAULT_PER_PAGE = 20;

export async function fetcher (url: string): Promise<any> {
    return fetch(url).then(res => res.json());
}

export const apiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): Promise<{ status: number, errors: any[], data: ResponseType<P, M> | null}> => {
    const pathParams = params[0]?.path;
    const queryParams = params[0]?.query;
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    const response =  await fetch(
        formattedUrl, {
            method: String(method),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
        }
    );
    const responseData = { status: response.status, errors: [] as any[], data: null };
    if (response.ok) {
        const result = await response.json()
        responseData.data = result;
    } else {
        if ([404, 400, 401, 403].includes(response.status)) {
            const errorData = await response.json();
            responseData.errors.push(errorData);
        } else {
            responseData.errors.push('Something went wrong');
        }
    }
    return responseData;
}

export function useApi <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    params: RequestParams<P, M>
): { data: ResponseType<P, M>, error: any, isLoading: boolean, mutate: any} {
    const pathParams = params?.path;
    const queryParams = params?.query;
    let shouldFetch = true;
    if (pathParams) {
        for (const key in pathParams) {
            if (!pathParams[key]) {
                shouldFetch = false; // Prevent fetching if path params are not set yet. Usually occures during cascade fetch
            }
        }
    }
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    const { data, error, isLoading, mutate } = useSWR(shouldFetch ? formattedUrl : null, fetcher);
    return {
        data: data,
        error: error,
        mutate: mutate,
        isLoading,
    }
}


export const usePaginatedApi = <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): { items: PaginatedResponseType<P, M>, error: any, isLoading: boolean, size: number, setSize: any } => {
    const getKey = (pageIndex: number, previousPageData: ResponseType<P, M>) => {
        let to_id = params[0]?.query?.last_id;
        let to_timestamp = params[0]?.query?.last_timestamp;
        const per_page = params[0]?.query?.per_page || DEFAULT_PER_PAGE;
        const lastItems = previousPageData?.items || [];
        if (previousPageData && lastItems.length == 0) {
            return null
        }
        if (previousPageData) {
            to_id = previousPageData.last_id;
            to_timestamp = previousPageData.last_timestamp;
        }
        const queryParams = { to_timestamp, to_id, per_page: per_page }
        return generateUrl(url.toString(), params[0]?.path, queryParams);
    }
    const { data, error, isLoading, size, setSize } = useSWRInfinite(
        getKey, fetcher, {revalidateFirstPage: false}
    )
    const items: PaginatedResponseType<P, M> = [];
    if (data) {
        for (const page_data of data) {
            items.push(...page_data.items)
        }
    }
    return {
        items: items,
        error, isLoading, size, setSize
    }
}