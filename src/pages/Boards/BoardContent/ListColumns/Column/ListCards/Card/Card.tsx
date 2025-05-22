import React from "react";
import {
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Card as MuiCard } from "@mui/material";
import { Attachment, Comment, Group } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardProps } from "~/types/card";

const Card: React.FC<CardProps> = ({ card }) => {
  const hasMembers = Boolean(card?.memberIds?.length);
  const hasComments = Boolean(card?.comments?.length);
  const hasAttachments = Boolean(card?.attachments?.length);
  const hasAnyActions = hasMembers || hasComments || hasAttachments;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });

  const dndKitCardStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
  };

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
        opacity: card.FE_PlaceholderCard ? "0" : "1",
        minWidth: card.FE_PlaceholderCard ? "280px" : "unset",
        pointerEvents: card.FE_PlaceholderCard ? "none" : "unset",
        position: card.FE_PlaceholderCard ? "fixed" : "unset",
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} />}
      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography variant="body2">{card?.title}</Typography>
      </CardContent>

      {hasAnyActions && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {hasMembers && (
            <Button size="small" startIcon={<Group />}>
              {card.memberIds?.length}
            </Button>
          )}
          {hasComments && (
            <Button size="small" startIcon={<Comment />}>
              {card.comments?.length}
            </Button>
          )}
          {hasAttachments && (
            <Button size="small" startIcon={<Attachment />}>
              {card.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
