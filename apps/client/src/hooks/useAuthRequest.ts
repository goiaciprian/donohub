import { useAuth } from '@clerk/clerk-react';
import { AxiosError, AxiosResponse } from 'axios';
import { RequestVars } from '@/utils';
import React from 'react';

export const useAuthRequest = <TResp, TParams, TBody>(
  request: (
    accessToken: string,
    params: RequestVars<TParams, TBody>,
  ) => Promise<AxiosResponse<TResp, TBody>>,
) => {
  const { getToken } = useAuth();
  const [_token, setToken] = React.useState<string | null>(null);

  const token = React.useCallback(async () => {
    let t = _token;
    if (!t) {
      t = await getToken();
      setToken(t);
    }
    return t;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, setToken]);

  const requestFnWithAuthToken = React.useCallback(
    async (p: RequestVars<TParams, TBody>) => {
      try {
        const receivedToken = await token();
        const requestCall = await request(receivedToken || '', p);
        return requestCall.data;
      } catch (err) {
        if (err instanceof AxiosError && err.status === 401) {
          const receivedToken = await token();
          const requestCall = await request(receivedToken || '', p);
          return requestCall.data;
        }
        throw err;
      }
    },
    [token, request],
  );

  return requestFnWithAuthToken;
};
