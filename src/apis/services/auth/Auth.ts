import { restClient } from "~/apis/restClient";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";
import { UserType } from "~/types/user";

/**
 * Login
 */
export const loginApiSpec: ApiSpec = {
  name: "login",
  method: HttpMethod.POST,
  uri: "/auths/login",
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresInSecs: number;
  user: UserType;
}
export const login = (request: LoginRequest) =>
  restClient
    .url(loginApiSpec.uri)
    .json(request)
    .post()
    .json<RestResponse<LoginResponse>>();

/**
 * Register
 */
export const registerApiSpec: ApiSpec = {
  name: "register",
  method: HttpMethod.POST,
  uri: "/auths/register",
};

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: UserType;
}
export const register = (request: RegisterRequest) =>
  restClient
    .url(registerApiSpec.uri)
    .json(request)
    .post()
    .json<RestResponse<RegisterResponse>>();

/**
 * Logout
 */
export const logoutApiSpec: ApiSpec = {
  name: "logout",
  method: HttpMethod.GET,
  uri: "/auths/logout",
};

export const logout = () =>
  restClient.url(logoutApiSpec.uri).get().res<RestResponse<any>>();
