import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import {
  createColumn,
  createColumnRequest,
} from "~/apis/services/column/Column";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";

export const useCreateColumn = () => {
  const setBoardData = useSetAtom(boardDataAtom);
  return useMutation<
    RestResponse<ColumnType>,
    RestError,
    createColumnRequest,
    ColumnType
  >({
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
      return tempColumn;
    },
    onSuccess: (response, variables, context) => {
      const actualColumn = response.data;
      const tempColumn = context as ColumnType;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedColumns = (prevBoard.columns || []).map((col) =>
          col._id === tempColumn._id ? actualColumn : col
        );
        const updatedColumnOrderIds = prevBoard.columnOrderIds.map((id) =>
          id === context?._id ? actualColumn._id : id
        );
        return {
          ...prevBoard,
          columns: updatedColumns,
          columnOrderIds: updatedColumnOrderIds,
        };
      });
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to create column. Please try again."
      );
    },
  });
};
