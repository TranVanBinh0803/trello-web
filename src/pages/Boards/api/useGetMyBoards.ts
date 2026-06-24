import { useQuery } from "@tanstack/react-query";
import { getMyBoards, getMyBoardsApiSpec } from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useGetMyBoards = (enabled = true) =>
  useQuery<RestResponse<BoardType[]>, RestError>({
    queryKey: [getMyBoardsApiSpec.name],
    queryFn: getMyBoards,
    staleTime: 1000 * 30,
    enabled,
  });
