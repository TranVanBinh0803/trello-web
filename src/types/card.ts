export interface CommentType {
  _id: string;
  authorName: string;
  avatar: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}
export interface AttachmentType {
  _id: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ActivityType {
  _id: string;
  actorId: string | null;
  actorName: string;
  actorAvatar: string | null;
  action: string;
  message: string;
  createdAt: string | number;
}

export interface CardLabelType {
  _id: string;
  title: string;
  color: string;
}

export interface ChecklistItemType {
  _id: string;
  title: string;
  completed: boolean;
  createdAt?: number;
}

export interface ChecklistType {
  _id: string;
  title: string;
  items: ChecklistItemType[];
  createdAt?: number;
}

export interface CardType {
  _id: string;
  boardId: string;
  columnId: string;
  description?: string | TrustedHTML;
  title?: string;
  cover?: string;
  completed?: boolean;
  labels?: CardLabelType[];
  startDate?: string | null;
  dueDate?: string | null;
  checklists?: ChecklistType[];
  memberIds?: string[];
  comments?: CommentType[];
  attachments?: AttachmentType[];
  activities?: ActivityType[];
  FE_PlaceholderCard?: boolean;
  sortable?: Object;
  archivedAt?: number | null;
  archivedBy?: string | null;
  archiveType?: string | null;
  _destroy?: boolean;
};

export type CardProps = {
  card: CardType;
  isDragging?: boolean;
  canEdit?: boolean;
};

export type ListCardsProps = {
  cards: CardType[];
  canEdit?: boolean;
};

