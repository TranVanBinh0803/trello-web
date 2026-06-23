import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

type DeleteCommentParams = {
  cardId: string;
  commentId: string;
};

export const useDeleteComment = () => {
  return useMutation<RestResponse<CardType>, RestError, DeleteCommentParams>({
    mutationFn: ({ cardId, commentId }) => deleteComment(cardId, commentId),
  });
};
