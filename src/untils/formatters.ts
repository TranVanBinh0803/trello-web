export const generatePlaceholderCard = (column: any) => {
    return {
      _id: `${column._id}-placeholder-card`,
      boardId: column.boardId,
      columnId: column._id,
      FE_PlaceholderCard: true
    }
}