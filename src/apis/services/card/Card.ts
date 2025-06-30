import { restClient } from "~/apis/restClient";
import { CardType, CommentType } from "~/types/card";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

/**
 * Create Card
 */
export const createCardApiSpec: ApiSpec = {
  name: "createCard",
  method: HttpMethod.POST,
  uri: "/cards",
};

export type createCardRequest = {
  title: string;
  boardId: string;
  columnId: string;
};

export const createCard = (request: createCardRequest) =>
  restClient
    .url(createCardApiSpec.uri)
    .json(request)
    .post()
    .json<RestResponse<CardType>>();

/**
 * Update Card
 */
export const updateCardApiSpec: ApiSpec = {
  name: "updateCard",
  method: HttpMethod.PATCH,
  uri: "/cards/:id",
};

export type updateCardRequest = {
  title?: string;
  description?: string;
};

export const updateCard = (cardId: string, request: updateCardRequest) =>
  restClient
    .url(updateCardApiSpec.uri.replace(":id", cardId))
    .json(request)
    .patch()
    .json<RestResponse<CardType>>();

/**
 * Add Comment
 */
export type addCommentRequest = {
  authorName: string | undefined;
  avatar: string | undefined;
  content: string;
};
export const addCommentApiSpec: ApiSpec = {
  name: "addComment",
  method: HttpMethod.POST,
  uri: "/cards/:id/comments",
};

export const addComment = (cardId: string, request: addCommentRequest) =>
  restClient
    .url(addCommentApiSpec.uri.replace(":id", cardId))
    .json(request)
    .post()
    .json<RestResponse<CardType>>();

/**
 * Update Comment
 */
export type updateCommentRequest = {
  commentId: string;
  content: string;
};
export const updateCommentApiSpec: ApiSpec = {
  name: "updateComment",
  method: HttpMethod.PATCH,
  uri: "/cards/:cardId/comments",
};

export const updateComment = (cardId: string, request: updateCommentRequest) =>
  restClient
    .url(updateCommentApiSpec.uri.replace(":cardId", cardId))
    .json(request)
    .patch()
    .json<RestResponse<CardType>>();

/**
 * Delete Comment
 */
export const deleteCommentApiSpec: ApiSpec = {
  name: "deleteComment",
  method: HttpMethod.DELETE,
  uri: "/cards/:cardId/comments",
};

export type deleteCommentRequest = {
  commentId: string;
};

export const deleteComment = (cardId: string, request: deleteCommentRequest) =>
  restClient
    .url(deleteCommentApiSpec.uri.replace(":cardId", cardId))
    .json(request)
    .delete()
    .json<RestResponse<CardType>>();
