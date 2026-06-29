import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addAttachment,
  addAttachmentApiSpec,
  addAttachmentRequest,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

export const useAddAttachment = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, addAttachmentRequest>({
    mutationKey: [addAttachmentApiSpec.name, cardId],
    mutationFn: (request) => addAttachment(cardId, request),
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to upload attachment."));
    },
  });
};
