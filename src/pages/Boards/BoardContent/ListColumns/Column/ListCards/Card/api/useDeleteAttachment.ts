import { useMutation } from "@tanstack/react-query";
import { deleteAttachment } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

type DeleteAttachmentParams = {
  cardId: string;
  attachmentId: string;
};

export const useDeleteAttachment = () => {
  return useMutation<RestResponse<CardType>, RestError, DeleteAttachmentParams>({
    mutationFn: ({ cardId, attachmentId }) => deleteAttachment(cardId, attachmentId),
  });
};
