import { BoardType } from "./board";
import { UserType } from "./user";

export type BoardInvitationStatus = "pending" | "accepted" | "rejected";

export interface BoardInvitationType {
  _id: string;
  boardId: string;
  inviterId: string;
  inviteeId: string;
  status: BoardInvitationStatus;
  board: BoardType;
  inviter: UserType;
  createdAt: number;
  updatedAt: number | null;
}
