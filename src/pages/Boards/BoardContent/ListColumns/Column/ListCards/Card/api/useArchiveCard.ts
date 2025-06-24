import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { archiveCard, archiveCardRequest } from "~/apis/services/column/Column";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { RestError, RestResponse } from "~/types/common";

export const useArchiveCard = (columnId: string) => {
  const setBoardData = useSetAtom(boardDataAtom);
  return useMutation<RestResponse<any>, RestError, archiveCardRequest>({
    mutationFn: (request) => archiveCard(columnId, request),
     onMutate: async (request) => {
      const { cardId } = request;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = (prevBoard.columns || []).map((column) => {
          if (column._id === columnId) {
            const updatedCards = column.cards.filter((card) => card._id !== cardId);
            const updatedCardOrderIds = column.cardOrderIds.filter((id) => id !== cardId);

            return {
              ...column,
              cards: updatedCards,
              cardOrderIds: updatedCardOrderIds,
            };
          }
          return column;
        });

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      return { cardId }; 
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to archive card. Please try again."
      );
    },
  });
};
