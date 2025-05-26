import { useMutation } from "@tanstack/react-query";
import { dragCardBetweenColumn, dragCardBetweenColumnRequest } from "~/apis/services/column/Column";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";

export const useDragCardBetweenColumn = () => {
  return useMutation<RestResponse<ColumnType>, RestError, dragCardBetweenColumnRequest>({
    mutationFn: (request) => dragCardBetweenColumn(request),
  });
};