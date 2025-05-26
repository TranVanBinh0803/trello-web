import { restClient } from "~/apis/restClient";
import { BoardType } from "~/types/board";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

export const getABoardApiSpec: ApiSpec = {
  name: 'getABoard',
  method: HttpMethod.GET,
  uri: '/boards/:id',
};

export const dragColumnApiSpec: ApiSpec = {
  name: 'dragColumn',
  method: HttpMethod.PUT,
  uri: '/boards/:id',
};

export type dragColumnRequest = {
  columnOrderIds: string[]
};

export const getABoard = (boardId: string) =>
  restClient
    .url(getABoardApiSpec.uri.replace(':id', boardId))
    .get()
    .json<RestResponse<BoardType>>();

export const dragColumn = (boardId: string, request: dragColumnRequest) =>
  restClient
    .url(dragColumnApiSpec.uri.replace(':id', boardId))
    .json(request)
    .put()
    .json<RestResponse<BoardType>>();