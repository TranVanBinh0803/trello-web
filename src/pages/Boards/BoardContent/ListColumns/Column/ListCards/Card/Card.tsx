import React, { MouseEvent, useState } from "react";
import {
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Card as MuiCard } from "@mui/material";
import {
  AddCard,
  Attachment,
  Cloud,
  Comment,
  ContentCut,
  DeleteForever,
  AccessTime,
  Group,
  PermIdentity,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardProps, CardType } from "~/types/card";
import { useArchiveCard } from "~/pages/Boards/api/useArchiveCard";

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const archiveCardMutation = useArchiveCard(card.columnId);

  const handleArchiveCard = (card: CardType) => {
    archiveCardMutation.mutate({ cardId: card._id });
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
      <CardContent
        sx={{
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "&:last-child": { p: 1.5 },
          "&:hover .edit-icon": {
            opacity: 1,
            transform: "scale(1)",
          },
          "&:hover .radio-icon": {
            opacity: 1,
            transform: "scale(1)",
          },
          "&:hover .card-title": {
            transform: "translateX(8px)",
          },
        }}
      >
        <Box
          className="radio-icon"
          sx={{
            opacity: 0,
            transform: "scale(0.8)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "flex",
            alignItems: "center",
            // mr: 1,
          }}
        >
          <RadioButtonUncheckedIcon fontSize="small" />
        </Box>
        <Typography
          variant="body2"
          className="card-title"
          sx={(theme) => ({
            flexGrow: 1,
            transition: "transform 0.3s ease"
          })}
        >
          {card?.title}
        </Typography>
        <Tooltip title="Edit card">
          <Box
            className="edit-icon"
            sx={{
              padding: "3px",
              borderRadius: "13px",
              height: "26px",
              opacity: 0,
              transform: "scale(0.8)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <EditNoteIcon
              sx={{ color: "text.primary", cursor: "pointer" }}
              fontSize="small"
              id="edit-card-dropdown"
              aria-controls={open ? "menu-edit-card-dropdown" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            />
          </Box>
        </Tooltip>
        <Menu
          id="menu-edit-card-dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            root: {
              "aria-labelledby": "edit-card-dropdown",
            },
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <AddCard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Open card</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <PermIdentity fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change members</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AccessTime fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit dates</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <Cloud fontSize="small" />
            </ListItemIcon>
            <ListItemText onClick={() => handleArchiveCard(card)}>
              Archive
            </ListItemText>
          </MenuItem>
        </Menu>
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
