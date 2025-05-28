import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "~/apis/queryClient";
import { getABoardApiSpec } from "~/apis/services/board/Board";
import { archiveCard, archiveCardRequest } from "~/apis/services/column/Column";
import { RestError, RestResponse } from "~/types/common";

export const useArchiveCard = (columnId: string) => {
  return useMutation<RestResponse<any>, RestError, archiveCardRequest>({
    mutationFn: (request) => archiveCard(columnId, request),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, "682aec06ccbbf399b8a14ea5"],
      });
      toast.success("Card archived successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to archive card. Please try again."
      );
    },
  });
};
