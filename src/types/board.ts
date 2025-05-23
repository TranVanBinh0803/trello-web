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
  columnOrderIds: string[];
  columns: ColumnType[];
};

export type BoardBarProps = {
  board: BoardType | null | undefined;
};

export type BoardContentProps = {
  board: BoardType | null | undefined;
}