import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteComment, deleteCommentApiSpec } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

type DeleteCommentParams = {
  cardId: string;
  commentId: string;
};

export const useDeleteComment = () => {
  return useMutation<RestResponse<CardType>, RestError, DeleteCommentParams>({
    mutationKey: [deleteCommentApiSpec.name],
    mutationFn: ({ cardId, commentId }) => deleteComment(cardId, commentId),
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to delete comment."));
    },
  });
};
