import { restClient } from "~/apis/restClient";
import { CardType } from "~/types/card";
import { ApiSpec, HttpMethod, RestResponse } from "~/types/common";

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
