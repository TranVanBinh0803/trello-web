import { restClient } from "~/apis/restClient";
import { BoardInvitationType } from "~/types/boardInvitation";
import { BoardType } from "~/types/board";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

export const getABoardApiSpec: ApiSpec = {
  name: 'getABoard',
  method: HttpMethod.GET,
  uri: '/boards/:id',
};

export const getMyBoardsApiSpec: ApiSpec = {
  name: "getMyBoards",
  method: HttpMethod.GET,
  uri: "/boards",
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

export const inviteBoardMemberApiSpec: ApiSpec = {
  name: "inviteBoardMember",
  method: HttpMethod.POST,
  uri: "/boards/:id/invitations",
};

export type dragColumnRequest = {
  columnOrderIds: string[]
};

export type archiveColumnRequest = {
  columnId: string
};

export interface InviteBoardMemberRequest {
  email: string;
}

export const getABoard = (boardId: string) =>
  restClient
    .url(getABoardApiSpec.uri.replace(':id', boardId))
    .get()
    .json<RestResponse<BoardType>>();

export const getMyBoards = () =>
  restClient
    .url(getMyBoardsApiSpec.uri)
    .get()
    .json<RestResponse<BoardType[]>>();

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

export const inviteBoardMember = (
  boardId: string,
  request: InviteBoardMemberRequest
) =>
  restClient
    .url(inviteBoardMemberApiSpec.uri.replace(":id", boardId))
    .json(request)
    .post()
    .json<RestResponse<BoardInvitationType>>();

export const importBoardApiSpec: ApiSpec = {
  name: "importBoard",
  method: HttpMethod.POST,
  uri: "/boards/import",
};

export const importBoard = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return restClient
    .url(importBoardApiSpec.uri)
    .body(formData)
    .post()
    .json<RestResponse<BoardType>>();
};

export const boardImportTemplateApiSpec: ApiSpec = {
  name: "boardImportTemplate",
  method: HttpMethod.GET,
  uri: "/boards/import-template",
};
