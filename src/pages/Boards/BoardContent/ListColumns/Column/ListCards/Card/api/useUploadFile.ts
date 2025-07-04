import { useMutation } from "@tanstack/react-query";
import { queryClient } from "~/apis/queryClient";
import { uploadFile, uploadFileRequest } from "~/apis/services/card/Card";
import { RestError, RestResponse } from "~/types/common";

export const useUploadFile = (cardId: string) => {
  return useMutation<RestResponse<any>, RestError, uploadFileRequest>({
    mutationFn: (request) => uploadFile(cardId, request),
  });
};
