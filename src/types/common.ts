export interface RestResponse<T> {
  statusCode: number;
  message: string;
  data: T;
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
  statusCode: number;
  message: string;
}

