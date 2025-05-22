import { ColumnType } from "./column";

enum Type {
  PUBLIC = "public",
  PRIVATE = "private",
}
export interface BoardType {
  _id: string;
  title: string;
  type: Type;
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