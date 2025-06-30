import { useMutation } from "@tanstack/react-query";
import { addComment, addCommentRequest} from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useAddComment = (cardId: string) => {
  return useMutation<RestResponse<any>, RestError, addCommentRequest>({
    mutationFn: (request) => addComment(cardId, request),
  });
};
