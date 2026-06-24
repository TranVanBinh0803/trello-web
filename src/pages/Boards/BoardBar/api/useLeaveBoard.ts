import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getABoardApiSpec,
  getMyBoardsApiSpec,
  leaveBoard,
} from "~/apis/services/board/Board";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useLeaveBoard = (boardId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setBoardData = useSetAtom(boardDataAtom);

  return useMutation<RestResponse<BoardType>, RestError, void>({
    mutationFn: () => leaveBoard(boardId),
    onSuccess: async () => {
      setBoardData(null);
      await queryClient.invalidateQueries({ queryKey: [getMyBoardsApiSpec.name] });
      await queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, boardId],
      });
      toast.success("You left the board");
      navigate("/boards");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to leave board");
    },
  });
};
