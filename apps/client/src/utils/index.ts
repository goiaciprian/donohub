import axios, { AxiosResponse } from "axios";

export type RequestVars<TParams, TBody > = {
    params?: TParams;
    body?: TBody;
    pathParams?: string;
}

export const createRequest = <TResp, TParams = object, TBody = object>(url: string, method: "GET" | "POST" | "PUT" | "DELETE") => {
    return (accessToken: string, params: RequestVars<TParams, TBody>) => axios<TResp, AxiosResponse<TResp, TBody>, TBody>({
        method: method,
        url: url + (params.pathParams ?? ''),
        data: params.body,
        params: params.params,
        headers: { Authorization: `Bearer ${accessToken}`}
    })
}