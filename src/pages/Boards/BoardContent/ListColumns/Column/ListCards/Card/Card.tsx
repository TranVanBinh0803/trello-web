import React, { MouseEvent, useEffect, useRef, useState } from "react";
import {
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Tooltip,
  Box,
  Checkbox,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Card as MuiCard } from "@mui/material";
import {
  Attachment,
  Comment,
  Group,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardProps, CardType } from "~/types/card";
import { useArchiveCard } from "./api/useArchiveCard";
import { useUpdateTitle } from "./api/useUpdateTitle";
import CardModal from "./components/CardModal";
import { manageModalAtom } from "~/atoms/ManageModalAtom";
import { useSetAtom } from "jotai";
import CardMenu from "./components/CardMenu";

const Card: React.FC<CardProps> = ({ card }) => {
  const hasMembers = Boolean(card?.memberIds?.length);
  const hasComments = Boolean(card?.comments?.length);
  const hasAttachments = Boolean(card?.attachments?.length);
  const hasAnyActions = hasMembers || hasComments || hasAttachments;

  const [openModal, setOpenModal] = React.useState(false);
  const setManageModal = useSetAtom(manageModalAtom);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
  });

  const handleOpenModal = () => {
    setOpenModal(true);
    setManageModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setManageModal(false);
  };

  const dndKitCardStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditCard = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [isEditing]);

  const handleInputBlur = () => {
    setIsEditing(false);
    card.title = editedTitle;
    updateTitleMutation.mutate({ title: editedTitle || "" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const archiveCardMutation = useArchiveCard(card.columnId);
  const updateTitleMutation = useUpdateTitle(card._id);

  const handleArchiveCard = (card: CardType) => {
    archiveCardMutation.mutate({ cardId: card._id });
  };

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: openModal ? "default" : "pointer",
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
            }}
          >
            <Tooltip title="Mark complete">
              <Checkbox
                size="small"
                icon={<RadioButtonUnchecked />}
                checkedIcon={<RadioButtonChecked />}
              />
            </Tooltip>
          </Box>

          {isEditing ? (
            <input
              ref={inputRef}
              value={editedTitle}
              onBlur={handleInputBlur}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flexGrow: 1,
                fontSize: "0.875rem",
                padding: "4px 8px",
                border: "2px solid #0079bf",
                borderRadius: "4px",
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          ) : (
            <Typography
              variant="body2"
              className="card-title"
              sx={{
                flexGrow: 1,
                transition: "transform 0.3s ease",
              }}
            >
              {card?.title}
            </Typography>
          )}

          {!isEditing && (
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
          )}

          <CardMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onEditCard={handleEditCard}
            onOpenCard={handleOpenModal}
            onArchiveCard={handleArchiveCard}
            card={card}
          />
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
      <CardModal open={openModal} onClose={handleCloseModal} card={card} />
    </>
  );
};

export default Card;