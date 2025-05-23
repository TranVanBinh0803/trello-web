import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { useGetABoard } from "~/pages/Boards/api/useGetABoard";

export const useBoardData = (boardId: string) => {
  const { data, isFetching } = useGetABoard(boardId);
  const setBoardData = useSetAtom(boardDataAtom);

  useEffect(() => {
    if (data?.data) {
      setBoardData(data.data);
    }
  }, [data, setBoardData]);

  return { isFetching };
};