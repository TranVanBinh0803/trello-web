import { useMutation } from "@tanstack/react-query";
import { updateTitle, updateTitleRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useUpdateTitle = (columnId: string, ) => {
  return useMutation<RestResponse<any>, RestError, updateTitleRequest>({
    mutationFn: (request) => updateTitle(columnId, request),
  });
};
