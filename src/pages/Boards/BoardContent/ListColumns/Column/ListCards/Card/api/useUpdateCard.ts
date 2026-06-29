import { useMutation } from "@tanstack/react-query";
import {
  updateCard,
  updateCardApiSpec,
  updateCardRequest,
} from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useUpdateCard = (cardId: string) => {
  return useMutation<RestResponse<CardType>, RestError, updateCardRequest>({
    mutationKey: [updateCardApiSpec.name, cardId],
    mutationFn: (request) => updateCard(cardId, request),
  });
};
