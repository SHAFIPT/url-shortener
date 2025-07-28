import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1/24, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict',
  });
};

export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};