import { useQuery } from "@tanstack/react-query";
import {
  getArchivedBoards,
  getArchivedBoardsApiSpec,
} from "~/apis/services/board/Board";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useGetArchivedBoards = (enabled = true) =>
  useQuery<RestResponse<BoardType[]>, RestError>({
    queryKey: [getArchivedBoardsApiSpec.name],
    queryFn: getArchivedBoards,
    staleTime: 1000 * 30,
    enabled,
  });
