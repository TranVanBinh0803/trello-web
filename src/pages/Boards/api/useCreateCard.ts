import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { createCard, createCardRequest } from "~/apis/services/card/Card";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useCreateCard = () => {
  const setBoardData = useSetAtom(boardDataAtom);

  return useMutation<RestResponse<CardType>, RestError, createCardRequest, CardType>({
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

      return tempCard;
    },
    onSuccess: (response, variables, context) => {
      const actualCard = response.data;

      setBoardData((prevBoard) => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = (prevBoard.columns || []).map((column) => {
          if (column._id === variables.columnId) {
            const updatedCards = column.cards.map((card) =>
              card._id === context._id ? actualCard : card
            );

            const updatedCardOrderIds = column.cardOrderIds.map((id) =>
              id === context._id ? actualCard._id : id
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
    onError: (error) => {
      toast.error(error?.message || "Failed to create card. Please try again.");
    },
  });
};
