import { useMutation } from "@tanstack/react-query";
import { updateAttachment, updateAttachmentRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

type UpdateAttachmentParams = {
  cardId: string;
  attachmentId: string;
  request: updateAttachmentRequest;
};

export const useUpdateAttachment = () => {
  return useMutation<RestResponse<CardType>, RestError, UpdateAttachmentParams>({
    mutationFn: ({ cardId, attachmentId, request }) =>
      updateAttachment(cardId, attachmentId, request),
  });
};

