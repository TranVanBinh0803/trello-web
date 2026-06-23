import { useMutation } from "@tanstack/react-query";
import { updateComment, updateCommentRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

type UpdateCommentParams = {
  cardId: string;
  commentId: string;
  request: updateCommentRequest;
};

export const useUpdateComment = () => {
  return useMutation<RestResponse<CardType>, RestError, UpdateCommentParams>({
    mutationFn: ({ cardId, commentId, request }) =>
      updateComment(cardId, commentId, request),
  });
};

