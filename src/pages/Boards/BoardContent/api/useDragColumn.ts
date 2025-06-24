import { useMutation } from "@tanstack/react-query";
import { dragColumn, dragColumnRequest } from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useDragColumn = (boardId: string) => {
  return useMutation<RestResponse<BoardType>, RestError, dragColumnRequest>({
    mutationFn: (request) => dragColumn(boardId, request),
  });
};
