import { useLayoutEffect } from "react";
import { useSetAtom } from "jotai";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { useGetABoard } from "~/pages/Boards/api/useGetABoard";

export const useBoardData = (boardId?: string) => {
  const { data, error, isError, isFetching } = useGetABoard(boardId);
  const setBoardData = useSetAtom(boardDataAtom);

  useLayoutEffect(() => {
    if (data?.data) {
      setBoardData(data.data);
    }
    if (isError) {
      setBoardData(null);
    }
  }, [data, isError, setBoardData]);

  return { error, isError, isFetching };
};
