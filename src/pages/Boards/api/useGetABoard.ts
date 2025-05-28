import { useQuery } from "@tanstack/react-query";
import { getABoard, getABoardApiSpec } from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useGetABoard = (boardId: string) =>
  useQuery<RestResponse<BoardType>, RestError>({
    queryKey: [getABoardApiSpec.name, boardId],
    queryFn: () => getABoard(boardId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
