import { ColumnType } from "~/types/column"

export const generatePlaceholderCard = (column: ColumnType) => {
    return {
      _id: `${column._id}-placeholder-card`,
      boardId: column.boardId,
      columnId: column._id,
      FE_PlaceholderCard: true
    }
}