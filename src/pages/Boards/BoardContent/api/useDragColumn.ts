import { useMutation } from "@tanstack/react-query";
import {
  dragColumn,
  dragColumnApiSpec,
  dragColumnRequest,
} from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useDragColumn = (boardId: string) => {
  return useMutation<RestResponse<BoardType>, RestError, dragColumnRequest>({
    mutationKey: [dragColumnApiSpec.name, boardId],
    mutationFn: (request) => dragColumn(boardId, request),
  });
};
