export interface RestResponse<T> {
  data: T;
  code: string;
  messages: string;
}

export enum CoreService {
  BOARD = 'board',
  COLUMN = 'column',
  CARD = 'card',
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}


export interface ApiSpec {
  name: string;
  method: HttpMethod;
  uri: string; 
}

export interface RestError {
  status: number;
  message: string;
}

