import { restClient } from "~/apis/restClient";
import { BoardType } from "~/types/board";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

export const getABoardApiSpec: ApiSpec = {
  name: 'getABoard',
  method: HttpMethod.GET,
  uri: '/boards/:id',
};

export const getABoard = (boardId: string) =>
  restClient
    .url(getABoardApiSpec.uri.replace(':id', boardId))
    .get()
    .json<RestResponse<BoardType>>();