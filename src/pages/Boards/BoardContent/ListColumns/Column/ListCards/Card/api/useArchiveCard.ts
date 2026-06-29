import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import {
  archiveCard,
  archiveCardApiSpec,
  archiveCardRequest,
} from "~/apis/services/column/Column";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

interface ArchiveCardContext {
  previousBoard: BoardType | null;
}

export const useArchiveCard = (columnId: string) => {
  const [boardData, setBoardData] = useAtom(boardDataAtom);
  const queryClient = useQueryClient();

  return useMutation<
    RestResponse<ColumnType>,
    RestError,
    archiveCardRequest,
    ArchiveCardContext
  >({
    mutationKey: [archiveCardApiSpec.name, columnId],
    mutationFn: (request) => archiveCard(columnId, request),
    onMutate: async (request) => {
      const { cardId } = request;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = (prevBoard.columns || []).map((column) => {
          if (column._id === columnId) {
            const updatedCards = column.cards.filter(
              (card) => card._id !== cardId
            );
            const updatedCardOrderIds = column.cardOrderIds.filter(
              (id) => id !== cardId
            );

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

      return {
        previousBoard: boardData,
      };
    },
    onError: (error, variables, context) => {
      if (context?.previousBoard) {
        setBoardData(context.previousBoard);
      }
      toast.error(getMutationErrorMessage(error, "Failed to archive card."));
    },
    onSettled: () => {
      invalidateBoardQueries(queryClient, boardData?._id);
    },
  });
};
