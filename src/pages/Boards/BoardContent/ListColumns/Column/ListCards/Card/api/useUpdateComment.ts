

import { useMutation } from "@tanstack/react-query";
import { updateComment, updateCommentRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useUpdateComment = (cardId: string) => {
  return useMutation<
    RestResponse<any>,
    RestError,
    updateCommentRequest
  >({
    mutationFn: (request) =>
      updateComment(cardId, request),
  });
};

