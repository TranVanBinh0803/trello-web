import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "~/untils/constants";

export interface PresenceChangedPayload {
  onlineUserIds: string[];
}

export interface BoardColumnEventPayload {
  boardId: string;
  columnId?: string;
  actorId?: string;
  columnOrderIds?: string[];
}

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});
