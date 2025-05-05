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

const Card = ({ card }) => {
  const hasMembers = Boolean(card?.memberIds?.length);
  const hasComments = Boolean(card?.comments?.length);
  const hasAttachments = Boolean(card?.attachments?.length);
  const hasAnyActions = hasMembers || hasComments || hasAttachments;

  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
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
              {card.memberIds.length}
            </Button>
          )}
          {hasComments && (
            <Button size="small" startIcon={<Comment />}>
              {card.comments.length}
            </Button>
          )}
          {hasAttachments && (
            <Button size="small" startIcon={<Attachment />}>
              {card.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
