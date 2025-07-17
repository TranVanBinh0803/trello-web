import { useMutation } from "@tanstack/react-query";
import { addAttachment, addAttachmentRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useAddAttachment = (cardId: string) => {
  return useMutation<RestResponse<any>, RestError, addAttachmentRequest>({
    mutationFn: (request) => addAttachment(cardId, request),
  });
};
