import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  restoreCard,
  restoreCardApiSpec,
} from "~/apis/services/column/Column";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

interface UseRestoreCardParams {
  boardId?: string;
}

interface RestoreCardRequest {
  columnId: string;
  cardId: string;
}

export const useRestoreCard = ({ boardId }: UseRestoreCardParams) => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<ColumnType>, RestError, RestoreCardRequest>({
    mutationKey: [restoreCardApiSpec.name, boardId],
    mutationFn: ({ columnId, cardId }) => restoreCard(columnId, cardId),
    onSuccess: () => {
      invalidateBoardQueries(queryClient, boardId);
      toast.success("Card restored");
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to restore card."));
    },
  });
};
