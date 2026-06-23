import { CardType } from "~/types/card";
import { ColumnType } from "~/types/column";

export const generatePlaceholderCard = (column: ColumnType): CardType => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
