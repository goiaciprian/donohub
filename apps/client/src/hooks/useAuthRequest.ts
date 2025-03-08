import { useAuth } from '@clerk/clerk-react';
import { AxiosResponse } from 'axios';
import { RequestVars } from '../utils';
import React from 'react';

export const useAuthRequest = <TResp, TBody = object, TParams = object>(
  request: (
    accessToken: string,
    params: RequestVars<TBody, TParams>
  ) => Promise<AxiosResponse<TResp, TBody>>
) => {
  const { getToken } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const setTokenAsync = async () => {
        const t =  await getToken();
        setToken(t);
    };
    if (!token) {
      setTokenAsync();
    }
  }, []);

  return (params: RequestVars<TBody, TParams>) => request(token ?? '', params).then(resp => resp.data);
};
