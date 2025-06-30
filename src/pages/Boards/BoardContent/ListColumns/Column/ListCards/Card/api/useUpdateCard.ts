import { useMutation } from "@tanstack/react-query";
import { updateCard, updateCardRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useUpdateCard = (columnId: string, ) => {
  return useMutation<RestResponse<any>, RestError, updateCardRequest>({
    mutationFn: (request) => updateCard(columnId, request),
  });
};
