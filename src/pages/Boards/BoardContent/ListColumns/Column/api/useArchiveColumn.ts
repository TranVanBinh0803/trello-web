import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import {
  archiveColumn,
  archiveColumnApiSpec,
  archiveColumnRequest,
} from "~/apis/services/board/Board";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

interface ArchiveColumnContext {
  previousBoard: BoardType | null;
}

export const useArchiveColumn = (boardId: string) => {
  const [boardData, setBoardData] = useAtom(boardDataAtom);
  const queryClient = useQueryClient();

  return useMutation<
    RestResponse<BoardType>,
    RestError,
    archiveColumnRequest,
    ArchiveColumnContext
  >({
    mutationKey: [archiveColumnApiSpec.name, boardId],
    mutationFn: (request) => archiveColumn(boardId, request),
    onMutate: async (request) => {
      const { columnId } = request;
      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedColumns = (prevBoard.columns || []).filter(
          (column) => column._id !== columnId
        );
        return {
          ...prevBoard,
          columns: updatedColumns,
          columnOrderIds: prevBoard.columnOrderIds.filter(
            (id) => id !== columnId
          ),
        };
      });
      return {
        previousBoard: boardData,
      };
    },
    onError: (error, variables, context) => {
      if (context?.previousBoard) {
        setBoardData(context.previousBoard);
      }
      toast.error(getMutationErrorMessage(error, "Failed to archive column."));
    },
    onSettled: () => {
      invalidateBoardQueries(queryClient, boardId);
    },
  });
};
