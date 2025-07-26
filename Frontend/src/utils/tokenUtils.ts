import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1, // 1 day
    secure: true,
    sameSite: 'Strict',
  });
};

export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};