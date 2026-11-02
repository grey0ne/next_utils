'use client'
import { useCallback } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import {
    PaginatedResponseType, PaginatedResponseTypeItems, Path, PathMethod, RequestParams,
    ResponseType, generateUrl, RequestBody
} from '@/next_utils/apiHelpers';
import { getCookie } from '@/next_utils/helpers';

const DEFAULT_PER_PAGE = 20;

class RequestError extends Error {
    status: number;
    info: any;

    constructor(message: string, status: number, info: any) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.info = info;
    }
}


export const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const error = new RequestError(
            'An error occurred while fetching the data.',
            response.status,
            await response.json()
        );
        throw error;
    }
    return response.json();
};

/**
 * Readable message for an error from processResponse: a string, {detail: string}
 * or a validation error {detail: [{msg, loc}, ...]}
 */
export function formatApiError(error: any, status?: number): string {
    const fallback = status ? `Request failed with status ${status}` : 'Request failed';
    if (!error) {
        return fallback;
    }
    if (typeof error === 'string') {
        return error;
    }
    const detail = error.detail ?? error;
    if (typeof detail === 'string') {
        return detail;
    }
    if (Array.isArray(detail)) {
        const messages = detail.map((item) => {
            if (typeof item === 'string') {
                return item;
            }
            const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : undefined;
            return item?.msg ? (field ? `${field}: ${item.msg}` : item.msg) : JSON.stringify(item);
        });
        return messages.join('; ') || fallback;
    }
    return fallback;
}

type ResponseData = {
    status: number,
    errors: any[],
    data: any | null
}

export async function untypedApiRequest(
    url: string,
    method: string,
    body: object,
): Promise<ResponseData> {
    return await performRequest(url, method, body);
}


async function processResponse(response: any): Promise<ResponseData> {
    const responseData = { status: response.status, errors: [] as any[], data: null };
    if (response.ok) {
        const result = await response.json()
        responseData.data = result;
    } else {
        if (response.status >= 400 && response.status < 500) {
            const text = await response.text();
            try {
                responseData.errors.push(JSON.parse(text));
            } catch {
                responseData.errors.push(text || `Request failed with status ${response.status}`);
            }
        } else {
            responseData.errors.push('Something went wrong');
        }
    }
    return responseData;
}


function getHeaders() {
    return {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
    };
}


async function performRequest(
    url: string,
    method: string,
    body: any,
): Promise<ResponseData> {
    const headers = getHeaders();
    // fetch upper-cases only standard methods; a lowercase "patch" is rejected (nginx: 400).
    const httpMethod = String(method).toUpperCase();
    const response =  await fetch(
        url, {
            method: httpMethod,
            headers: headers,
            // A JSON request needs a JSON body: an empty one fails endpoints with an all-optional body schema
            body: httpMethod === 'GET' || httpMethod === 'HEAD' ? undefined : JSON.stringify(body ?? {})
        }
    );
    return await processResponse(response);
}


export const apiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    params: RequestParams<P, M>
): Promise<{ data: ResponseType<P, M> | null, errors: any, status: number}> => {
    const pathParams = params?.path;
    const queryParams = params?.query;
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    return await performRequest(formattedUrl, method.toString(), body);
}


export const apiPost = async <P extends Path>(
    url: P,
    body: RequestBody<P, 'post'> extends undefined ? object : RequestBody<P, 'post'>,
    params: RequestParams<P, 'post'>
): Promise<{ data: ResponseType<P, 'post'> | null, errors: any, status: number}> => {
    // convery params to any to avoid errors on APIs without post requests
    const untypedParams = params as any
    const pathParams = untypedParams?.path;
    const queryParams = untypedParams?.query;
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    return await performRequest(formattedUrl, 'post', body);
}


export function useApi <P extends Path>(
    url: P,
    params: RequestParams<P, 'get'>,
    shouldFetch: boolean = true
): { data: ResponseType<P, 'get'>, error: any, isLoading: boolean, mutate: any} {
    const pathParams = params?.path;
    const queryParams = params?.query;
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    const { data, error, isLoading, mutate } = useSWR(shouldFetch ? formattedUrl : null, fetcher);
    return {
        data: data,
        error: error,
        mutate: mutate,
        isLoading,
    }
}


export const usePaginatedApi = <P extends Path>(
    url: P,
    initialData?: PaginatedResponseType<P, 'get'>,
    ...params: RequestParams<P, 'get'> extends undefined ? Array<any> : [RequestParams<P, 'get'>]
): {
    items: PaginatedResponseTypeItems<P, 'get'>,
    error: any,
    isLoading: boolean,
    size: number,
    setSize: (size: any) => void,
    mutate: () => void
} => {
    const getKey = (pageIndex: number, previousPageData: PaginatedResponseType<P, 'get'>) => {
        let to_id = params[0]?.query?.last_id;
        let to_timestamp = params[0]?.query?.last_timestamp;
        const per_page = params[0]?.query?.per_page || DEFAULT_PER_PAGE;
        if (previousPageData) {
            to_id = previousPageData.last_id;
            to_timestamp = previousPageData.last_timestamp;
        }
        const lastItems = previousPageData?.items || [];
        if (previousPageData && lastItems.length < per_page) {
            return null
        }
        const queryParams = { ...params[0]?.query, to_timestamp, to_id, per_page: per_page }
        const resultUrl = generateUrl(url.toString(), params[0]?.path, queryParams);
        return resultUrl;
    }
    const revalidate = initialData === undefined;
    const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite(
        getKey, fetcher, 
        {
            initialSize: 1,
            revalidateOnMount: revalidate,
            revalidateOnFocus: false,
            revalidateAll: false,
            revalidateFirstPage: revalidate,
            fallbackData: initialData ? [initialData] : undefined
        }
    )
    // Revalidation only: callers often pass it as a callback (e.g. onSuccess(formData)),
    // and SWR mutate called with an argument would replace the cached pages with it
    const revalidateList = useCallback(() => { mutate(); }, [mutate]);
    const items: PaginatedResponseTypeItems<P, 'get'> = [];
    if (data) {
        for (const page_data of data) {
            items.push(...page_data.items)
        }
    }
    return {
        items: items,
        error,
        isLoading,
        size,
        setSize,
        mutate: revalidateList
    }
}
