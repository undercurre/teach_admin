import { request } from '@umijs/max';
import { Result } from '.';

const authport = '/auth';

export interface PublicKeyRes {
  publicKey: string;
}

export interface LoginRes {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

export interface ReqLoginForm {
  username: string;
  password: string;
  key: string;
  iv: string;
}

export const getPublicKey = () => {
  return request<Result<PublicKeyRes>>(authport + '/public-key', {
    method: 'GET',
  });
};

export const loginApi = (params: ReqLoginForm) => {
  return request<Result<LoginRes>>(authport + '/login', {
    method: 'POST',
    data: params,
  });
};

export const refreshToken = () => {
  return request<
    Result<{
      access_token: string;
    }>
  >(authport + '/refresh-token', {
    method: 'POST',
    withCredentials: true,
  });
};
