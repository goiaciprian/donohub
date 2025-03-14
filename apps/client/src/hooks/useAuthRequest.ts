import { useAuth } from '@clerk/clerk-react';
import { AxiosError, AxiosResponse } from 'axios';
import { RequestVars } from '../utils';
import React from 'react';

export const useAuthRequest = <TResp, TBody = object, TParams = object>(
  request: (
    accessToken: string,
    params: RequestVars<TBody, TParams>
  ) => Promise<AxiosResponse<TResp, TBody>>
) => {
  const { getToken } = useAuth();
  const [token, setToken] = React.useState<string>('');

  const fetchNewToken = React.useCallback(async () => {
    setToken(await getToken({
      template: 'main'
    }) ?? '')
  }, [getToken, setToken]);

  React.useEffect(() => {
    fetchNewToken()
  }, [fetchNewToken]);

  const requestFnWithAuthToken = React.useCallback(async (p: RequestVars<TBody, TParams>) => {
    try {
      const requestCall = await request(token ?? '', p);
      return requestCall.data;
    } catch(err) {
      if(err instanceof AxiosError && err.status === 401) {
        await fetchNewToken();
        const requestCall = await request(token ?? '', p);
        return requestCall.data
      }
      throw err;
    }
  }, [token, fetchNewToken, request])

  

  return requestFnWithAuthToken;
};
