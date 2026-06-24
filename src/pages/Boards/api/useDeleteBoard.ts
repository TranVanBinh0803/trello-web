import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteBoard,
  deleteBoardApiSpec,
  getMyBoardsApiSpec,
} from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<BoardType>, RestError, string>({
    mutationKey: [deleteBoardApiSpec.name],
    mutationFn: deleteBoard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [getMyBoardsApiSpec.name] });
      toast.success("Board deleted");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete board");
    },
  });
};
