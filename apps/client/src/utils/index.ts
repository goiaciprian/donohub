import axios, { AxiosResponse } from 'axios';
import { TFunction } from 'i18next';

export type RequestVars<TParams, TBody> = {
  params?: TParams;
  body?: TBody;
  pathParams?: { key: string; value: string }[];
};

export const createRequest = <TResp, TParams = object, TBody = object>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
) => {
  return (accessToken: string, params: RequestVars<TParams, TBody>) =>
    axios<TResp, AxiosResponse<TResp, TBody>, TBody>({
      method: method,
      //   url: url + (params.pathParams ?? ''),
      url: (params.pathParams ?? []).reduce((url, current) => {
        return url.replace(current.key, current.value);
      }, url),
      data: params.body,
      params: params.params,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
};

export const getErrorMessage = (
  status: number,
  t: TFunction<'translation', undefined>,
) => {
  switch (status) {
    case 401:
      return t('unauthorized');
    case 404:
    default:
      return t('notFound');
  }
};

export const DATE_FORMAT = 'MMMM DD, yyyy HH:MM';