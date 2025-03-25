import { paths } from '@/api/apiTypes';

export type Path = keyof paths;
export type PathMethod<T extends Path> = keyof paths[T];

export type RequestParams<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    parameters: any;
}
    ? paths[P][M]['parameters']
    : undefined;

export type RequestBody<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    requestBody: any;
}
    ? paths[P][M]['requestBody']['content']['application/json']
    : undefined;

export type ResponseType<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    responses: { 200: { content: {[x: string]: any } } };
}
    ? paths[P][M]['responses'][200]['content']['application/json']
    : undefined;

export type Error400Type<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    responses: { 400: { content: {[x: string]: any } } };
}
    ? paths[P][M]['responses'][400]['content']['application/json']
    : undefined;

export type PaginatedResponseType<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    responses: { 200: { content: {[x: string]: any } } };
}
    ? paths[P][M]['responses'][200]['content']['application/json']['items']
    : any[];

export function formatUrl(url: string, params: any): string {
    let result = url;
    for (const param_name in params) {
        result = result.replace(`{${param_name}}`, params[param_name]);
    }
    return result;
}

export function generateUrl(url: string, pathParams: {[key: string]: string | number} , queryParams?: {[key: string]: any}): string {
    let formattedUrl = `${url}`;
    if (pathParams) {
        formattedUrl = formatUrl(url, pathParams);
    }
    if (queryParams) {
        const filteredParams: {[key:string] : any} = {};
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) {
                filteredParams[key] = value;
            }
        }
        const params_str = new URLSearchParams(filteredParams).toString();
        formattedUrl = `${formattedUrl}?${params_str}`;
    }
    return formattedUrl
}