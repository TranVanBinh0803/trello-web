import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { archiveColumn, archiveColumnRequest} from "~/apis/services/board/Board";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { RestError, RestResponse } from "~/types/common";

export const useArchiveColumn = (boardId: string) => {
  const setBoardData = useSetAtom(boardDataAtom);
  return useMutation<RestResponse<any>, RestError, archiveColumnRequest>({
    mutationFn: (request) => archiveColumn(boardId, request),
    onMutate: async (request) => {
      const { columnId } = request;
      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedColumns = (prevBoard.columns || []).filter(column => column._id !== columnId);
        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });
      return columnId; 
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to archive column. Please try again."
      );
    },
  });
};
