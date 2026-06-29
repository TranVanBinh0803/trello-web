import type { QueryClient } from "@tanstack/react-query";
import { getABoardApiSpec, getMyBoardsApiSpec } from "~/apis/services/board/Board";
import type { RestError } from "~/types/common";

export const getMutationErrorMessage = (
  error: RestError | null | undefined,
  fallback: string,
) => error?.message || fallback;

export const invalidateBoardQueries = (
  queryClient: QueryClient,
  boardId?: string,
) => {
  if (boardId) {
    queryClient.invalidateQueries({
      queryKey: [getABoardApiSpec.name, boardId],
    });
  }

  queryClient.invalidateQueries({
    queryKey: [getMyBoardsApiSpec.name],
  });
};
