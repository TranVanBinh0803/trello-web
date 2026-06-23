import { restClient } from "~/apis/restClient";
import { BoardInvitationType } from "~/types/boardInvitation";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";
import { UserType } from "~/types/user";

export const getBoardInvitationsApiSpec: ApiSpec = {
  name: "getBoardInvitations",
  method: HttpMethod.GET,
  uri: "/users/me/board-invitations",
};

export const acceptBoardInvitationApiSpec: ApiSpec = {
  name: "acceptBoardInvitation",
  method: HttpMethod.PATCH,
  uri: "/users/me/board-invitations/:invitationId/accept",
};

export const rejectBoardInvitationApiSpec: ApiSpec = {
  name: "rejectBoardInvitation",
  method: HttpMethod.PATCH,
  uri: "/users/me/board-invitations/:invitationId/reject",
};

export const updateProfileApiSpec: ApiSpec = {
  name: "updateProfile",
  method: HttpMethod.PATCH,
  uri: "/users/me",
};

export interface UpdateProfileRequest {
  username: string;
  avatarFile: File | null;
}

export const getBoardInvitations = () =>
  restClient
    .url(getBoardInvitationsApiSpec.uri)
    .get()
    .json<RestResponse<BoardInvitationType[]>>();

export const acceptBoardInvitation = (invitationId: string) =>
  restClient
    .url(
      acceptBoardInvitationApiSpec.uri.replace(":invitationId", invitationId)
    )
    .patch()
    .json<RestResponse<BoardInvitationType>>();

export const rejectBoardInvitation = (invitationId: string) =>
  restClient
    .url(
      rejectBoardInvitationApiSpec.uri.replace(":invitationId", invitationId)
    )
    .patch()
    .json<RestResponse<BoardInvitationType>>();

export const updateProfile = (request: UpdateProfileRequest) => {
  const formData = new FormData();
  formData.append("username", request.username);
  if (request.avatarFile) {
    formData.append("avatar", request.avatarFile);
  }

  return restClient
    .url(updateProfileApiSpec.uri)
    .body(formData)
    .patch()
    .json<RestResponse<UserType>>();
};
