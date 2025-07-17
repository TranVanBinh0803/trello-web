import { useMutation } from "@tanstack/react-query";
import { updateAttachment, updateAttachmentRequest, updateComment, updateCommentRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

type UpdateAttachmentParams = {
  cardId: string;
  attachmentId: string;
  request: updateAttachmentRequest;
};

export const useUpdateAttachment = () => {
  return useMutation<RestResponse<any>, RestError, UpdateAttachmentParams>({
    mutationFn: ({ cardId, attachmentId, request }) =>
      updateAttachment(cardId, attachmentId, request),
  });
};

