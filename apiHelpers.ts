import { paths } from '@/api/apiTypes';

type GetItemsPath = {
    responses: {
        200: {
            content: {
                'application/json': {
                    items: Array<any>;
                }
            }
        }
    }
}

type PostDataPath = {
    post: any
}

export type Path = keyof paths;
export type ItemsPath = {
    [K in keyof paths]: paths[K]['get'] extends GetItemsPath ? K : never
}[keyof paths];
export type PostPath = {
    [K in keyof paths]: paths[K] extends PostDataPath ? K : never
}[keyof paths];

export type PathMethod<T extends Path> = keyof paths[T];


export type RequestParams<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    parameters: any;
}
    ? paths[P][M]['parameters']
    : undefined;


export type RequestPathParams<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    parameters: {path: any};
}
    ? paths[P][M]['parameters']['path']
    : undefined;


export type RequestBody<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    requestBody: { content: {[x: string]: any } };
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
    responses: { 200: { content: { 'application/json': {items: Array<any>, last_id: number, last_timestamp: string} } } };
}
    ? paths[P][M]['responses'][200]['content']['application/json']
    : { items: Array<any>, last_id: number | null, last_timestamp: string | null };

export type PaginatedResponseTypeItems<P extends Path, M extends PathMethod<P>> = paths[P][M] extends {
    responses: { 200: { content: { 'application/json': { items: Array<any>} } } };
}
    ? paths[P][M]['responses'][200]['content']['application/json']['items']
    : Array<any>;

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