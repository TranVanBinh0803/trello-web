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
  method: HttpMethod.PATCH,
  uri: '/boards/:id',
};

export const archiveColumnApiSpec: ApiSpec = {
  name: 'archiveColumn',
  method: HttpMethod.DELETE,
  uri: '/boards/:id',
};

export type dragColumnRequest = {
  columnOrderIds: string[]
};

export type archiveColumnRequest = {
  columnId: string
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
    .patch()
    .json<RestResponse<BoardType>>();

export const archiveColumn = (boardId: string, request: archiveColumnRequest) =>
  restClient
    .url(archiveColumnApiSpec.uri.replace(":id", boardId))
    .json(request)
    .delete()
    .json<RestResponse<BoardType>>();