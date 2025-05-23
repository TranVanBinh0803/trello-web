import { restClient } from "~/apis/restClient";
import { BoardType } from "~/types/board";
import { ColumnType } from "~/types/column";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

export const createColumnApiSpec: ApiSpec = {
  name: "createColumn",
  method: HttpMethod.POST,
  uri: "/columns",
};

export type createColumnRequest = {
  title: string;
  boardId: string;
};

export const createColumn = (request: createColumnRequest) =>
  restClient
    .url(createColumnApiSpec.uri)
    .json(request)
    .post()
    .json<RestResponse<ColumnType>>();
