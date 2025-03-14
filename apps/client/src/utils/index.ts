import axios, { AxiosResponse } from "axios";
import { TFunction } from "i18next";

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

export const getErrorMessage = (status: number, t: TFunction<"translation", undefined>) => {
    switch (status) {
        case 401:
            return t('unauthorized')
        case 404:
        default: return t('notFound')
    }
}