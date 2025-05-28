import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "~/apis/queryClient";
import { getABoardApiSpec } from "~/apis/services/board/Board";
import { createCard, createCardRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useCreateCard = () => {
  return useMutation<RestResponse<CardType>, RestError, createCardRequest>({
    mutationFn: createCard,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, variables.boardId],
      });
      toast.success("Card created successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create card. Please try again.");
    },
  });
};
