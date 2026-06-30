import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { user } from "~/atoms/AuthAtoms";
import { onlineUserIdsAtom } from "~/atoms/PresenceAtom";
import { queryClient } from "~/apis/queryClient";
import {
  getABoardApiSpec,
  getArchivedBoardItemsApiSpec,
} from "~/apis/services/board/Board";
import {
  socket,
  type BoardColumnEventPayload,
  type PresenceChangedPayload,
} from "~/sockets/socketClient";

const BOARD_COLUMN_EVENTS = [
  "board:column-created",
  "board:column-updated",
  "board:column-archived",
  "board:column-restored",
] as const;

export const useBoardSocket = (boardId?: string) => {
  const currentUser = useAtomValue(user);
  const setOnlineUserIds = useSetAtom(onlineUserIdsAtom);

  useEffect(() => {
    if (!boardId || !currentUser?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("user:online", { userId: currentUser._id });
    socket.emit("board:join", { boardId });

    const handlePresenceChanged = (payload: PresenceChangedPayload) => {
      setOnlineUserIds(payload.onlineUserIds);
    };

    const handleColumnChanged = (payload: BoardColumnEventPayload) => {
      if (payload.boardId !== boardId) return;

      queryClient.invalidateQueries({
        queryKey: [getABoardApiSpec.name, boardId],
      });
      queryClient.invalidateQueries({
        queryKey: [getArchivedBoardItemsApiSpec.name, boardId],
      });
    };

    socket.on("presence:changed", handlePresenceChanged);
    BOARD_COLUMN_EVENTS.forEach((eventName) => {
      socket.on(eventName, handleColumnChanged);
    });

    return () => {
      socket.emit("board:leave", { boardId });
      socket.off("presence:changed", handlePresenceChanged);
      BOARD_COLUMN_EVENTS.forEach((eventName) => {
        socket.off(eventName, handleColumnChanged);
      });
    };
  }, [boardId, currentUser?._id, setOnlineUserIds]);
};
