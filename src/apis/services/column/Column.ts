import { restClient } from "~/apis/restClient";
import { BoardType } from "~/types/board";
import { CardType } from "~/types/card";
import { ColumnType } from "~/types/column";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

export const createColumnApiSpec: ApiSpec = {
  name: "createColumn",
  method: HttpMethod.POST,
  uri: "/columns",
};

export const dragCardApiSpec: ApiSpec = {
  name: "dragCard",
  method: HttpMethod.PATCH,
  uri: "/columns/:id",
};

export const archiveCardApiSpec: ApiSpec = {
  name: "archiveCard",
  method: HttpMethod.DELETE,
  uri: "/columns/:id",
};

export const dragCardBetweenColumnApiSpec: ApiSpec = {
  name: "dragCardBetweenColumn",
  method: HttpMethod.PUT,
  uri: "/columns/between-column",
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

export type dragCardRequest = {
  cardOrderIds: string[];
};

export type archiveCardRequest = {
  cardId: string;
};

export type dragCardBetweenColumnRequest = {
  oldColumnId: string;
  oldCardOrderIds: string[];
  newColumnId: string;
  newCardOrderIds: string[];
  cardId: string;
};

export const dragCard = (columnId: string, request: dragCardRequest) =>
  restClient
    .url(dragCardApiSpec.uri.replace(":id", columnId))
    .json(request)
    .patch()
    .json<RestResponse<ColumnType>>();

export const dragCardBetweenColumn = (request: dragCardBetweenColumnRequest) =>
  restClient
    .url(dragCardBetweenColumnApiSpec.uri)
    .json(request)
    .put()
    .json<RestResponse<ColumnType>>();

export const archiveCard = (columnId: string, request: archiveCardRequest) =>
  restClient
    .url(archiveCardApiSpec.uri.replace(":id", columnId))
    .json(request)
    .delete()
    .json<RestResponse<ColumnType>>();
