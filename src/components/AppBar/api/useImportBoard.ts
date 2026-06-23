import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { importBoard } from "~/apis/services/board/Board";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { BoardType } from "~/types/board";
import { RestError, RestResponse } from "~/types/common";

export const useImportBoard = () => {
  const setBoardData = useSetAtom(boardDataAtom);
  const navigate = useNavigate();

  return useMutation<RestResponse<BoardType>, RestError, File>({
    mutationFn: importBoard,
    onSuccess: (response) => {
      setBoardData(response.data);
      navigate(`/boards/${response.data._id}`);
      toast.success("Board imported successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to import board");
    },
  });
};
