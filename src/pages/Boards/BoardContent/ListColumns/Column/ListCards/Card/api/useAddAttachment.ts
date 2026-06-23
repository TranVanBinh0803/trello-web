import { useMutation } from "@tanstack/react-query";
import { addAttachment, addAttachmentRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useAddAttachment = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, addAttachmentRequest>({
    mutationFn: (request) => addAttachment(cardId, request),
  });
};
