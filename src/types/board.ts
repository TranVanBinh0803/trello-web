import { ColumnType } from "./column";

export interface BoardType {
  _id: string;
  title: string;
  type: "public" | "private";
  description: string;
  ownerIds?: string[]; 
  memberIds?: string[];
  columnOrerIds: string[];
  column: ColumnType[];
};

export type BoardBarProps = {
  board: BoardType;
};

export type BoardContentProps = {
  board: BoardType | null | undefined;
}