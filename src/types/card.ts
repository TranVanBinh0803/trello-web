export interface CardType {
  _id: string;
  boardId: string;
  columnId: string;
  title?: string;
  cover?: string;
  memberIds?: string[];
  comments?: { id: string; content: string }[];
  attachments?: { id: string; name: string }[];
  FE_PlaceholderCard?: boolean;
  sortable?: Object;
};

export type CardProps = {
  card: CardType;
  isDragging?: boolean;
};

export type ListCardsProps = {
  cards: CardType[];
};

