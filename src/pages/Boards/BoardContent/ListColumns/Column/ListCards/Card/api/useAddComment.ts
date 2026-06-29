import { useMutation } from "@tanstack/react-query";
import {
  addComment,
  addCommentApiSpec,
  addCommentRequest,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { toast } from "react-toastify";
import { getMutationErrorMessage } from "~/untils/mutations";

export const useAddComment = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, addCommentRequest>({
    mutationKey: [addCommentApiSpec.name, cardId],
    mutationFn: (request) => addComment(cardId, request),
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to add comment."));
    },
  });
};
