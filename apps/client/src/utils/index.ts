import axios, { AxiosResponse } from 'axios';
import { TFunction } from 'i18next';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ExtractPathParams<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? `:${Param}` | ExtractPathParams<Rest>
    : T extends `${infer _}:${infer Param}`
      ? `:${Param}`
      : never;

export type RequestVars<
  TParams,
  TBody,
  TUrl extends string,
> = (ExtractPathParams<TUrl> extends never
  ? { pathParams?: undefined }
  : {
      pathParams: { key: ExtractPathParams<TUrl>; value: string }[];
    }) &
  (TParams extends undefined ? { params?: undefined } : { params: TParams }) &
  (TBody extends undefined ? { body?: undefined } : { body: TBody });

const createRequest = <TResp, TParams, TBody, TUrl extends string>(
  url: TUrl,
  method: Methods,
) => {
  return (accessToken: string, params: RequestVars<TParams, TBody, TUrl>) => {
    return axios<TResp, AxiosResponse<TResp, TBody>, TBody>({
      method: method,
      url: (params.pathParams ?? []).reduce((url, current) => {
        return url.replace(current.key, current.value);
      }, url as string),
      data: params.body,
      params: params.params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'api-key': import.meta.env.VITE_API_KEY,
      },
    });
  };
};

export const withRequest =
  <TUrl extends string>(url: TUrl) =>
  <TResp, TParams = undefined, TBody = undefined>(method: Methods) =>
    createRequest<TResp, TParams, TBody, TUrl>(url, method);

export const getErrorMessage = (status: number, t: TFunction) => {
  switch (status) {
    case 401:
      return t('unauthorized');
    case 500:
      return t('internal.smtWrong');
    case 404:
    default:
      return t('notFound');
  }
};

export const DATE_FORMAT = 'MMMM DD, yyyy HH:MM';
