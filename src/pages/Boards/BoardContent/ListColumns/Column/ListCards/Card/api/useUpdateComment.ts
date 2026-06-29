import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateComment,
  updateCommentApiSpec,
  updateCommentRequest,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

type UpdateCommentParams = {
  cardId: string;
  commentId: string;
  request: updateCommentRequest;
};

export const useUpdateComment = () => {
  return useMutation<RestResponse<CardType>, RestError, UpdateCommentParams>({
    mutationKey: [updateCommentApiSpec.name],
    mutationFn: ({ cardId, commentId, request }) =>
      updateComment(cardId, commentId, request),
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to update comment."));
    },
  });
};

