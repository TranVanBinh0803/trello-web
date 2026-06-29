import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import {
  createCard,
  createCardApiSpec,
  createCardRequest,
} from "~/apis/services/card/Card";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";
import {
  getMutationErrorMessage,
  invalidateBoardQueries,
} from "~/untils/mutations";

interface CreateCardContext {
  previousBoard: BoardType | null;
  tempCard: CardType;
}

export const useCreateCard = () => {
  const [boardData, setBoardData] = useAtom(boardDataAtom);
  const queryClient = useQueryClient();

  return useMutation<
    RestResponse<CardType>,
    RestError,
    createCardRequest,
    CreateCardContext
  >({
    mutationKey: [createCardApiSpec.name],
    mutationFn: createCard,
    onMutate: async (newCardData) => {
      const tempCard: CardType = {
        _id: `temp-card-${Date.now()}`,
        title: newCardData.title,
        boardId: newCardData.boardId,
        columnId: newCardData.columnId,
      };

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedColumns = (prevBoard.columns || []).map((column) => {
          if (column._id === newCardData.columnId) {
            const updatedCards = [...(column.cards ?? []), tempCard];
            const updatedCardOrderIds = [
              ...(column.cardOrderIds ?? []),
              tempCard._id,
            ];

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
        tempCard,
      };
    },
    onSuccess: (response, variables, context) => {
      const actualCard = response.data;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = (prevBoard.columns || []).map((column) => {
          if (column._id === variables.columnId) {
            const updatedCards = column.cards.map((card) =>
              card._id === context.tempCard._id ? actualCard : card
            );

            const updatedCardOrderIds = column.cardOrderIds.map((id) =>
              id === context.tempCard._id ? actualCard._id : id
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
    },
    onError: (error, variables, context) => {
      if (context?.previousBoard) {
        setBoardData(context.previousBoard);
      }
      toast.error(getMutationErrorMessage(error, "Failed to create card."));
    },
    onSettled: (response, error, variables) => {
      invalidateBoardQueries(queryClient, variables.boardId);
    },
  });
};
