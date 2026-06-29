import { useQuery } from "@tanstack/react-query";
import {
  ArchivedBoardItemsResponse,
  getArchivedBoardItems,
  getArchivedBoardItemsApiSpec,
} from "~/apis/services/board/Board";
import { RestError, RestResponse } from "~/types/common";

export const useGetArchivedBoardItems = (
  boardId: string | undefined,
  enabled = true
) =>
  useQuery<RestResponse<ArchivedBoardItemsResponse>, RestError>({
    queryKey: [getArchivedBoardItemsApiSpec.name, boardId],
    queryFn: () => getArchivedBoardItems(boardId || ""),
    enabled: Boolean(boardId) && enabled,
  });
