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
  cover?: string;
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
  content: string;
};
export const updateCommentApiSpec: ApiSpec = {
  name: "updateComment",
  method: HttpMethod.PATCH,
  uri: "/cards/:cardId/comments/:commentId",
};

export const updateComment = (
  cardId: string,
  commentId: string,
  request: updateCommentRequest
) =>
  restClient
    .url(
      updateCommentApiSpec.uri
        .replace(":cardId", cardId)
        .replace(":commentId", commentId)
    )
    .json(request)
    .patch()
    .json<RestResponse<CardType>>();

/**
 * Delete Comment
 */
export const deleteCommentApiSpec: ApiSpec = {
  name: "deleteComment",
  method: HttpMethod.DELETE,
  uri: "/cards/:cardId/comments/:commentId",
};

export const deleteComment = (cardId: string, commentId: string) =>
  restClient
    .url(
      deleteCommentApiSpec.uri
        .replace(":cardId", cardId)
        .replace(":commentId", commentId)
    )
    .delete()
    .json<RestResponse<CardType>>();

/**
 * Upload file
 */

export type uploadFileRequest = {
  file: File;
};

export const uploadFileApiSpec: ApiSpec = {
  name: "uploadFile",
  method: HttpMethod.POST,
  uri: "/cards/:cardId/uploadFile",
};

export const uploadFile = (cardId: string, request: uploadFileRequest) => {
  const formData = new FormData();
  formData.append("file", request.file);
  console.log("req.file:", request.file);

  return restClient
    .url(uploadFileApiSpec.uri.replace(":cardId", cardId))
    .body(formData)
    .post()
    .json<RestResponse<CardType>>();
};
