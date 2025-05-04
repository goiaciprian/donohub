import { AxiosError, AxiosResponse } from 'axios';
import { RequestVars } from '@/utils';
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';

export const useAuthRequest = <TResp, TParams, TBody, TUrl extends string>(
  request: (
    accessToken: string,
    params: RequestVars<TParams, TBody, TUrl>,
  ) => Promise<AxiosResponse<TResp, TBody>>,
) => {
  const { token, generate } = useAuthContext();

  const requestFnWithAuthToken = React.useCallback(
    async (p: RequestVars<TParams, TBody, TUrl>) => {
      try {
        const requestCall = await request(token, p);
        return requestCall.data;
      } catch (err) {
        if (err instanceof AxiosError && err.status === 401) {
          const _token = await generate();
          const requestCall = await request(_token, p);
          return requestCall.data;
        }
        throw err;
      }
    },
    [token, generate, request],
  );

  return requestFnWithAuthToken;
};
