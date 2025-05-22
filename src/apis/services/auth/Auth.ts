import { restClient } from '~/apis/restClient';
import { ApiSpec, HttpMethod, RestResponse } from '~/types/common';


/**
 * createToken
 */
export const loginApiSpec: ApiSpec = {
  name: 'login',
  method: HttpMethod.POST,
  uri: '/auth/login',
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresInSecs: number;
}



/**
 * signOut
 */
export const signOutApiSpec: ApiSpec = {
  name: 'signOut',
  method: HttpMethod.POST,
  uri: '/auth/sign-out',
};


export const login = (request: LoginRequest) =>
  restClient
    .url(loginApiSpec.uri)
    .json(request)
    .post()
    .json<RestResponse<LoginResponse>>();

export const signOut = () => restClient.url(signOutApiSpec.uri).post().res<void>();
