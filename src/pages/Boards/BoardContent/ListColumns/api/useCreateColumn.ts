import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import {
  createColumn,
  createColumnApiSpec,
  createColumnRequest,
} from "~/apis/services/column/Column";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

interface CreateColumnContext {
  previousBoard: BoardType | null;
  tempColumn: ColumnType;
}

export const useCreateColumn = () => {
  const [boardData, setBoardData] = useAtom(boardDataAtom);
  const queryClient = useQueryClient();

  return useMutation<
    RestResponse<ColumnType>,
    RestError,
    createColumnRequest,
    CreateColumnContext
  >({
    mutationKey: [createColumnApiSpec.name],
    mutationFn: createColumn,
    onMutate: async (newColumnData) => {
      const tempColumn: ColumnType = {
        _id: `temp-${Date.now()}`,
        title: newColumnData.title,
        boardId: newColumnData.boardId,
        cards: [],
        cardOrderIds: [],
      };
      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;

        return {
          ...prevBoard,
          columns: [...(prevBoard.columns ?? []), tempColumn],
          columnOrderIds: [...prevBoard.columnOrderIds, tempColumn._id],
        };
      });
      return {
        previousBoard: boardData,
        tempColumn,
      };
    },
    onSuccess: (response, variables, context) => {
      const actualColumn = response.data;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedColumns = (prevBoard.columns || []).map((col) =>
          col._id === context.tempColumn._id ? actualColumn : col
        );
        const updatedColumnOrderIds = prevBoard.columnOrderIds.map((id) =>
          id === context.tempColumn._id ? actualColumn._id : id
        );
        return {
          ...prevBoard,
          columns: updatedColumns,
          columnOrderIds: updatedColumnOrderIds,
        };
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousBoard) {
        setBoardData(context.previousBoard);
      }
      toast.error(getMutationErrorMessage(error, "Failed to create column."));
    },
    onSettled: (response, error, variables) => {
      invalidateBoardQueries(queryClient, variables.boardId);
    },
  });
};
