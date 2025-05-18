import { useAuth } from '@clerk/clerk-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useCookies } from 'react-cookie';

interface IAuthContext {
  token: string;
  generate: () => Promise<string>;
}

const initialState: IAuthContext = {
  generate: async () => {
    return '';
  },
  token: '',
};

export interface AuthCookies {
  token: string | null;
  'api-key': string,
}

export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const { getToken } = useAuth();
  const [cookies, setCookies] = useCookies<keyof AuthCookies>();

  const generateToken = useCallback(async () => {
    const token = await getToken();
    setCookies('token', token, { secure: true, sameSite: 'strict' });
    return token ?? '';
  }, [getToken, setCookies]);

  useEffect(() => {
    const initialToken = async () => {
      await generateToken();
    };

    initialToken();
  }, [generateToken]);

  useEffect(() => {
    setCookies('api-key', import.meta.env.VITE_API_KEY, { secure: true })
  }, [setCookies])

  return (
    <AuthContext.Provider
      value={{ generate: generateToken, token: cookies.token ?? '' }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
