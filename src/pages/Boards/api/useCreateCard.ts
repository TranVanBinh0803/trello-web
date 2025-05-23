import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "~/apis/queryClient";
import { getABoardApiSpec } from "~/apis/services/board/Board";
import { createCard, createCardRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";

export const useCreateCard = () => {
  return useMutation<RestResponse<CardType>, RestError, createCardRequest>({
    mutationFn: createCard,
    onSuccess: (response, variables) => {
      toast.success("Card created successfully!");
      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, variables.boardId],
      });
    //   queryClient.setQueryData(
    //     [getABoardApiSpec.name, variables.boardId],
    //     (oldData: any) => {
    //       if (!oldData?.data) return oldData;

    //       const newCard = response.data;
    //       const updatedColumns = oldData.data.columns.map((col: ColumnType) => {
    //         if (col._id === variables.columnId) {
    //           return {
    //             ...col,
    //             cards: [...col.cards, newCard],
    //             cardOrderIds: [...col.cardOrderIds, newCard._id],
    //           };
    //         }
    //         return col;
    //       });

    //       return {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           columns: updatedColumns,
    //         },
    //       };
    //     }
    //   );
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create card. Please try again.");
    },
  });
};
