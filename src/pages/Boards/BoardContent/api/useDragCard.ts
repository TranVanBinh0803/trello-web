import { useMutation } from "@tanstack/react-query";
import { dragCard, dragCardRequest } from "~/apis/services/column/Column";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";

export const useDragCard = (columnId: string) => {
  return useMutation<RestResponse<ColumnType>, RestError, dragCardRequest>({
    mutationFn: (request) => dragCard(columnId, request),
  });
};
