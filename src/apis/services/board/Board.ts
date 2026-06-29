import { restClient } from "~/apis/restClient";
import { BoardInvitationType } from "~/types/boardInvitation";
import { BoardType } from "~/types/board";
import { CardType } from "~/types/card";
import { ColumnType } from "~/types/column";
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

export const getArchivedBoardsApiSpec: ApiSpec = {
  name: "getArchivedBoards",
  method: HttpMethod.GET,
  uri: "/boards/archived",
};

export const getArchivedBoardItemsApiSpec: ApiSpec = {
  name: "getArchivedBoardItems",
  method: HttpMethod.GET,
  uri: "/boards/:id/archived-items",
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

export const leaveBoardApiSpec: ApiSpec = {
  name: "leaveBoard",
  method: HttpMethod.DELETE,
  uri: "/boards/:id/members/me",
};

export const archiveBoardApiSpec: ApiSpec = {
  name: "archiveBoard",
  method: HttpMethod.DELETE,
  uri: "/boards/:id/archive",
};

export const restoreBoardApiSpec: ApiSpec = {
  name: "restoreBoard",
  method: HttpMethod.PATCH,
  uri: "/boards/:id/restore",
};

export const restoreColumnApiSpec: ApiSpec = {
  name: "restoreColumn",
  method: HttpMethod.PATCH,
  uri: "/boards/:id/columns/:columnId/restore",
};

export const createPrivateUpgradePaymentApiSpec: ApiSpec = {
  name: "createPrivateUpgradePayment",
  method: HttpMethod.POST,
  uri: "/boards/:id/private-upgrade-payment",
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

export interface ArchivedBoardItemsResponse {
  columns: ColumnType[];
  cards: CardType[];
}

export interface PrivateUpgradePaymentResponse {
  amount: number;
  paymentUrl: string;
  txnRef: string;
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

export const getArchivedBoards = () =>
  restClient
    .url(getArchivedBoardsApiSpec.uri)
    .get()
    .json<RestResponse<BoardType[]>>();

export const getArchivedBoardItems = (boardId: string) =>
  restClient
    .url(getArchivedBoardItemsApiSpec.uri.replace(":id", boardId))
    .get()
    .json<RestResponse<ArchivedBoardItemsResponse>>();

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

export const leaveBoard = (boardId: string) =>
  restClient
    .url(leaveBoardApiSpec.uri.replace(":id", boardId))
    .delete()
    .json<RestResponse<BoardType>>();

export const archiveBoard = (boardId: string) =>
  restClient
    .url(archiveBoardApiSpec.uri.replace(":id", boardId))
    .delete()
    .json<RestResponse<BoardType>>();

export const restoreBoard = (boardId: string) =>
  restClient
    .url(restoreBoardApiSpec.uri.replace(":id", boardId))
    .patch()
    .json<RestResponse<BoardType>>();

export const restoreColumn = (boardId: string, columnId: string) =>
  restClient
    .url(
      restoreColumnApiSpec.uri
        .replace(":id", boardId)
        .replace(":columnId", columnId)
    )
    .patch()
    .json<RestResponse<ColumnType>>();

export const createPrivateUpgradePayment = (boardId: string) =>
  restClient
    .url(createPrivateUpgradePaymentApiSpec.uri.replace(":id", boardId))
    .post()
    .json<RestResponse<PrivateUpgradePaymentResponse>>();

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
