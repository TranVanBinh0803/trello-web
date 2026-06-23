import { useMutation } from "@tanstack/react-query";
import { updateCard, updateCardRequest } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useUpdateCard = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, updateCardRequest>({
    mutationFn: (request) => updateCard(cardId, request),
  });
};
