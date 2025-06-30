import { useMutation } from "@tanstack/react-query";
import { deleteComment, deleteCommentRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useDeleteComment = (cardId: string) => {
  return useMutation<RestResponse<any>, RestError, deleteCommentRequest>({
    mutationFn: (request) => deleteComment(cardId, request),
  });
};
