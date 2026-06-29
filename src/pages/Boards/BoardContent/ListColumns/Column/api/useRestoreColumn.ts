import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  restoreColumn,
  restoreColumnApiSpec,
} from "~/apis/services/board/Board";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

export const useRestoreColumn = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<ColumnType>, RestError, string>({
    mutationKey: [restoreColumnApiSpec.name, boardId],
    mutationFn: (columnId) => restoreColumn(boardId, columnId),
    onSuccess: () => {
      invalidateBoardQueries(queryClient, boardId);
      toast.success("Column restored");
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to restore column."));
    },
  });
};
