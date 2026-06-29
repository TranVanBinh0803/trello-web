import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteAttachment,
  deleteAttachmentApiSpec,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

type DeleteAttachmentParams = {
  cardId: string;
  attachmentId: string;
};

export const useDeleteAttachment = () => {
  return useMutation<RestResponse<CardType>, RestError, DeleteAttachmentParams>({
    mutationKey: [deleteAttachmentApiSpec.name],
    mutationFn: ({ cardId, attachmentId }) => deleteAttachment(cardId, attachmentId),
    onError: (error) => {
      toast.error(
        getMutationErrorMessage(error, "Failed to delete attachment.")
      );
    },
  });
};
