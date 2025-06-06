'use client'
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
        if ([404, 400, 401, 403].includes(response.status)) {
            const errorData = await response.json();
            responseData.errors.push(errorData);
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
    const response =  await fetch(
        url, {
            method: String(method),
            headers: getHeaders(),
            body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
        }
    );
    return await processResponse(response);
}


export const apiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    params: RequestParams<P, M>
): Promise<ResponseData> => {
    const pathParams = params?.path;
    const queryParams = params?.query;
    const formattedUrl = generateUrl(url.toString(), pathParams, queryParams); 
    return await performRequest(formattedUrl, method.toString(), body);
}


export function useApi <P extends Path>(
    url: P,
    params: RequestParams<P, 'get'>
): { data: ResponseType<P, 'get'>, error: any, isLoading: boolean, mutate: any} {
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


export const usePaginatedApi = <P extends Path>(
    url: P,
    ...params: RequestParams<P, 'get'> extends undefined ? Array<any> : [RequestParams<P, 'get'>]
): { items: PaginatedResponseTypeItems<P, 'get'>, error: any, isLoading: boolean, size: number, setSize: (size: any) => void } => {
    const getKey = (pageIndex: number, previousPageData: PaginatedResponseType<P, 'get'>) => {
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
        setSize
    }
}