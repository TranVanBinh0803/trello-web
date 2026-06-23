import { useMutation } from "@tanstack/react-query";
import { addComment, addCommentRequest} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useAddComment = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, addCommentRequest>({
    mutationFn: (request) => addComment(cardId, request),
  });
};
