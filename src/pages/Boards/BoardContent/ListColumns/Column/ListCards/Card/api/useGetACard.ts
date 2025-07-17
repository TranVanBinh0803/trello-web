import { useQuery } from "@tanstack/react-query";
import { getACard, getACardApiSpec } from "~/apis/services/card/Card";
import { CardType } from "~/types/card";
import { RestError, RestResponse } from "~/types/common";

export const useGetACard = (cardId: string) =>
  useQuery<RestResponse<CardType>, RestError>({
    queryKey: [getACardApiSpec.name, cardId],
    queryFn: () => getACard(cardId),
    enabled: Boolean(cardId && cardId !== "")
  });