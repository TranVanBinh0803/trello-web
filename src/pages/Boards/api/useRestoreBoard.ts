import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getArchivedBoardsApiSpec,
  getMyBoardsApiSpec,
  restoreBoard,
  restoreBoardApiSpec,
} from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

export const useRestoreBoard = () => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<BoardType>, RestError, string>({
    mutationKey: [restoreBoardApiSpec.name],
    mutationFn: restoreBoard,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getMyBoardsApiSpec.name] }),
        queryClient.invalidateQueries({
          queryKey: [getArchivedBoardsApiSpec.name],
        }),
      ]);
      toast.success("Board restored");
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, "Failed to restore board."));
    },
  });
};
