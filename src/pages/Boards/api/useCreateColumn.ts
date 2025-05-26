import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "~/apis/queryClient";
import { getABoardApiSpec } from "~/apis/services/board/Board";
import {
  createColumn,
  createColumnRequest,
} from "~/apis/services/column/Column";
import { ColumnType } from "~/types/column";
import { RestError, RestResponse } from "~/types/common";

export const useCreateColumn = () => {
  return useMutation<RestResponse<ColumnType>, RestError, createColumnRequest>({
    mutationFn: createColumn,
    onSuccess: (response, variables) => {
      toast.success("Column created successfully!");
      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, variables.boardId],
      });
      // queryClient.setQueryData([getABoardApiSpec.name, "682aec06ccbbf399b8a14ea5"], (oldData: any) => {
      //   if (!oldData?.data) return oldData;

      //   return {
      //     ...oldData,
      //     data: {
      //       ...oldData.data,
      //       columnOrderIds: [...oldData.data.columnOrderIds, response.data._id],
      //       columns: [...oldData.data.columns, response.data],
      //     },
      //   };
      // });
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to create column. Please try again."
      );
    },
  });
};
