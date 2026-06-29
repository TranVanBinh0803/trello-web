import { CardType } from "./card";

export interface ColumnType {
  _id: string;
  title: string;
  cards: CardType[];
  cardOrderIds: string[];
  boardId: string;
  archivedAt?: number | null;
  archivedBy?: string | null;
  archiveType?: string | null;
  _destroy?: boolean;
}

export type ColumnProps = {
  column: ColumnType;
  isDragging?: boolean;
  isUsingDragOverlay?: boolean;
  canEdit?: boolean;
};

export type ListColumnsProps = {
  columns: ColumnType[];
  canEdit?: boolean;
};

export type NewColumn = {
  boardId: string;
  title: string;
}
