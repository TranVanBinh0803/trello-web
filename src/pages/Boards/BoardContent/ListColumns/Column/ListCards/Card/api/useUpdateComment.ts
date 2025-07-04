import { useMutation } from "@tanstack/react-query";
import { updateComment, updateCommentRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

type UpdateCommentParams = {
  cardId: string;
  commentId: string;
  request: updateCommentRequest;
};

export const useUpdateComment = () => {
  return useMutation<RestResponse<any>, RestError, UpdateCommentParams>({
    mutationFn: ({ cardId, commentId, request }) =>
      updateComment(cardId, commentId, request),
  });
};

