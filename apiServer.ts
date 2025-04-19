import {
    Path, PathMethod, RequestParams,
    ResponseType, generateUrl, RequestBody
} from '@/next_utils/apiHelpers';
import { cookies } from 'next/headers'

const BACKEND_URL = `http://${process.env.PROJECT_NAME}-django:8000`;

export const apiGet = async <P extends Path>(
    url: P,
    ...params: RequestParams<P, 'get'> extends undefined ? [] : [RequestParams<P, 'get'>]
): Promise<{ errors: string[], data: ResponseType<P, 'get'> | null}> => {
    return apiRequest(url, 'get', {}, ...params); 
}


export const apiRequest = async <P extends Path, M extends PathMethod<P>>(
    url: P,
    method: M,
    body: RequestBody<P, M> extends undefined ? object : RequestBody<P, M>,
    ...params: RequestParams<P, M> extends undefined ? [] : [RequestParams<P, M>]
): Promise<{ errors: string[], data: ResponseType<P, M> | null}> => {
    const pathParams = params[0]?.path;
    const queryParams = params[0]?.query;
    const formattedUrl = BACKEND_URL + generateUrl(url, pathParams, queryParams); 
    const cookieStore = await cookies();
    const cookieHeader = `sessionid=${cookieStore.get('sessionid')?.value}`;
    const response =  await fetch(
        formattedUrl, {
            method: String(method),
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
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