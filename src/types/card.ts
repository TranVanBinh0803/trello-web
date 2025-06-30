export interface CommentType {
  _id: string;
  authorName: string;
  avatar: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}
export interface CardType {
  _id: string;
  boardId: string;
  columnId: string;
  description?: string | TrustedHTML;
  title?: string;
  cover?: string;
  memberIds?: string[];
  comments?: CommentType[];
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

