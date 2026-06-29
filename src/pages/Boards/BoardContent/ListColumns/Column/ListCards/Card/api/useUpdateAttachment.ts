import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateAttachment,
  updateAttachmentApiSpec,
  updateAttachmentRequest,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

type UpdateAttachmentParams = {
  cardId: string;
  attachmentId: string;
  request: updateAttachmentRequest;
};

export const useUpdateAttachment = () => {
  return useMutation<RestResponse<CardType>, RestError, UpdateAttachmentParams>({
    mutationKey: [updateAttachmentApiSpec.name],
    mutationFn: ({ cardId, attachmentId, request }) =>
      updateAttachment(cardId, attachmentId, request),
    onError: (error) => {
      toast.error(
        getMutationErrorMessage(error, "Failed to update attachment.")
      );
    },
  });
};

