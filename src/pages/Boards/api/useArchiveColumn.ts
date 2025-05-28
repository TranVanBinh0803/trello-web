import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "~/apis/queryClient";
import { archiveColumn, archiveColumnRequest, getABoardApiSpec } from "~/apis/services/board/Board";
import { RestError, RestResponse } from "~/types/common";

export const useArchiveColumn = (boardId: string) => {
  return useMutation<RestResponse<any>, RestError, archiveColumnRequest>({
    mutationFn: (request) => archiveColumn(boardId, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, boardId],
      });
      toast.success("Column archived successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to archive column. Please try again."
      );
    },
  });
};
