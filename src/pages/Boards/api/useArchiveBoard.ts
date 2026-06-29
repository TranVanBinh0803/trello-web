import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  archiveBoard,
  archiveBoardApiSpec,
  getArchivedBoardsApiSpec,
  getMyBoardsApiSpec,
} from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

export const useArchiveBoard = () => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<BoardType>, RestError, string>({
    mutationKey: [archiveBoardApiSpec.name],
    mutationFn: archiveBoard,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getMyBoardsApiSpec.name] }),
        queryClient.invalidateQueries({
          queryKey: [getArchivedBoardsApiSpec.name],
        }),
      ]);
      toast.success("Board archived");
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to archive board."));
    },
  });
};
