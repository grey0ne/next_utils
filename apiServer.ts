import {
    Path, PathMethod, RequestParams,
    ResponseType, generateUrl, RequestBody
} from '@/next_utils/apiHelpers';
import { cookies } from 'next/headers'

const BACKEND_URL = `http://${process.env.PROJECT_NAME}-django:8000`;

/**
 * Server-side API Get function. 
 * @Example
 * const { errors, data } = await apiGet('/api/tasks/user/{user_id}' { path: { user_id: 1 } })
 */
export const apiGet = async <P extends Path>(
    url: P,
    ...params: RequestParams<P, 'get'> extends undefined ? [] : [RequestParams<P, 'get'>]
): Promise<{ errors: string[], data: ResponseType<P, 'get'> | null}> => {
    return apiRequest(url, 'get', {}, ...params); 
}

/**
 * 
 * Server-side API Get function that does not require authentication. Used for static cached routes
 */
export const anonymousApiGet = async <P extends Path>(
    url: P,
    cacheTag: string,
    ...params: RequestParams<P, 'get'> extends undefined ? [] : [RequestParams<P, 'get'>]
): Promise<{ errors: string[], data: ResponseType<P, 'get'> | null}> => {
    return anonymousApiRequest(url, 'get', cacheTag, {}, ...params); 
}

function getFormattedUrl<P extends Path>(url: P, params: RequestParams<P, 'get'> extends undefined ? [] : [RequestParams<P, 'get'>]) {
    const pathParams = params[0]?.path;
    const queryParams = params[0]?.query;
    return BACKEND_URL + generateUrl(url, pathParams, queryParams); 
}

export const anonymousApiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    cacheTag: string,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): Promise<{ errors: string[], data: ResponseType<P, M> | null}> => {
    const formattedUrl = getFormattedUrl(url, params); 
    const response =  await fetch(
        formattedUrl, {
            next: { tags: [cacheTag] },
            method: String(method),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (response.ok) {
        const result = await response.json()
        return { errors: [], data: result };
    } else {
        return { errors: [`Response status ${response.status}`], data: null }
    }
}

const getCookieHeader = async () => {
    const cookieStore = await cookies();
    return cookieStore.getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
}

export const apiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): Promise<{ errors: string[], data: ResponseType<P, M> | null}> => {
    const formattedUrl = getFormattedUrl(url, params); 
    const response =  await fetch(
        formattedUrl, {
            method: String(method),
            headers: {
                "Content-Type": "application/json",
                "Cookie": await getCookieHeader()
            },
            cache: 'no-store',
        }
    );
    if (response.ok) {
        const result = await response.json()
        return { errors: [], data: result };
    } else {
        return { errors: [`Response status ${response.status}`], data: null }
    }
}