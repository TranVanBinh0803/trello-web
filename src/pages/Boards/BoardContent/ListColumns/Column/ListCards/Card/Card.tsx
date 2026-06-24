import React, { MouseEvent, useEffect, useRef, useState } from "react";
import {
  Typography,
  CardActions,
  CardContent,
  CardMedia,
  Tooltip,
  Box,
  Checkbox,
  Chip,
  LinearProgress,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import { Card as MuiCard } from "@mui/material";
import {
  Attachment,
  Notes,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Schedule,
  TaskAlt,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardProps, CardType } from "~/types/card";
import { useArchiveCard } from "./api/useArchiveCard";
import CardModal from "./components/CardModal";
import { manageModalAtom } from "~/atoms/ManageModalAtom";
import { useSetAtom } from "jotai";
import CardMenu from "./components/CardMenu";
import { useUpdateCard } from "./api/useUpdateCard";
import { useGetABoard } from "~/pages/Boards/api/useGetABoard";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const completedRadioSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  overflow: "visible",
  color: "text.secondary",
  "& .MuiSvgIcon-root": {
    position: "relative",
    zIndex: 1,
  },
  "&.Mui-checked": {
    color: "success.main",
  },
  "&.Mui-checked::after": {
    content: '""',
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: `conic-gradient(
      from 0deg,
      transparent 0deg 32deg,
      ${theme.palette.success.main} 32deg 40deg,
      transparent 40deg 82deg,
      ${theme.palette.success.main} 82deg 90deg,
      transparent 90deg 132deg,
      ${theme.palette.success.main} 132deg 140deg,
      transparent 140deg 182deg,
      ${theme.palette.success.main} 182deg 190deg,
      transparent 190deg 232deg,
      ${theme.palette.success.main} 232deg 240deg,
      transparent 240deg 282deg,
      ${theme.palette.success.main} 282deg 290deg,
      transparent 290deg 332deg,
      ${theme.palette.success.main} 332deg 340deg,
      transparent 340deg 360deg
    )`,
    animation: "completedRadioSpark 900ms ease-out forwards",
    zIndex: 0,
  },

  "@keyframes completedRadioSpark": {
    "0%": { opacity: 0.9, transform: "scale(0.55) rotate(0deg)" },
    "100%": { opacity: 0, transform: "scale(1.45) rotate(22deg)" },
  },
});

const Card: React.FC<CardProps> = ({ card, canEdit = true }) => {
  const getBoardQuery = useGetABoard(card.boardId);
  const hasDescription = Boolean(card?.description);
  const hasComments = Boolean(card?.comments?.length);
  const hasAttachments = Boolean(card?.attachments?.length);
  const hasDates = Boolean(card.startDate || card.dueDate);
  const checklistItems = (card.checklists ?? []).flatMap(
    (checklist) => checklist.items
  );
  const completedChecklistItems = checklistItems.filter(
    (item) => item.completed
  ).length;
  const hasChecklist = checklistItems.length > 0;
  const checklistProgress = hasChecklist
    ? Math.round((completedChecklistItems / checklistItems.length) * 100)
    : 0;
  const isChecklistCompleted =
    hasChecklist && completedChecklistItems === checklistItems.length;
  const hasAnyActions =
    hasDescription || hasComments || hasAttachments || hasDates || hasChecklist;

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
    disabled: !canEdit,
  });

  const handleOpenModal = () => {
    setOpenModal(true);
    setManageModal(true);
  };

  const handleCloseModal = () => {
    getBoardQuery.refetch();
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
    if (!canEdit) return;
    const previousTitle = card.title;
    setIsEditing(false);
    card.title = editedTitle;
    updateCardMutation.mutate(
      { title: editedTitle },
      {
        onError: (error) => {
          card.title = previousTitle;
          setEditedTitle(previousTitle);
          toast.error(error?.message || "Failed to update card title");
          getBoardQuery.refetch();
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const archiveCardMutation = useArchiveCard(card.columnId);
  const updateCardMutation = useUpdateCard(card._id);

  const setCardCompleted = (completed: boolean) => {
    if (!canEdit) return;
    const previousCompleted = Boolean(card.completed);
    card.completed = completed;
    updateCardMutation.mutate(
      { completed },
      {
        onError: (error) => {
          card.completed = previousCompleted;
          toast.error(error?.message || "Failed to update card");
          getBoardQuery.refetch();
        },
      }
    );
  };

  const handleToggleCompleted = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    setCardCompleted(event.target.checked);
  };

  const handleRadioClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCardCompleted(!Boolean(card.completed));
  };

  const handleArchiveCard = (card: CardType) => {
    if (!canEdit) return;
    archiveCardMutation.mutate({ cardId: card._id });
  };

  const isCoverColor = card?.cover?.startsWith("#");
  const hasCover = Boolean(card?.cover && card?.cover !== "");

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        onClick={!canEdit ? handleOpenModal : undefined}
        sx={{
          cursor: openModal ? "default" : "pointer",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
          overflow: "unset",
          opacity: card.FE_PlaceholderCard ? "0" : "1",
          minWidth: card.FE_PlaceholderCard ? "280px" : "unset",
          pointerEvents: card.FE_PlaceholderCard ? "none" : "unset",
          position: card.FE_PlaceholderCard ? "fixed" : "relative",
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
        {canEdit && !isEditing && (
          <Tooltip title="Edit card">
            <Box
              className="edit-icon"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                padding: "3px",
                borderRadius: "13px",
                height: "26px",
                width: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transform: "scale(0.8)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(4px)",
                zIndex: 1,
                "&:hover": {
                  backgroundColor: "rgba(245, 245, 245, 0.95)",
                },
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

        {hasCover && (
          <>
            {isCoverColor ? (
              <Box
                sx={{
                  height: 36,
                  backgroundColor: card.cover,
                  width: "100%",
                  borderRadius: 1,
                }}
              />
            ) : (
              <CardMedia sx={{ height: 140 }} image={card.cover} />
            )}
          </>
        )}

        {Boolean(card.labels?.length) && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", px: 1, pt: 1 }}>
            {card.labels?.map((label) => (
              <Box
                key={label._id}
                sx={{
                  width: 44,
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: label.color,
                }}
              />
            ))}
          </Box>
        )}

        <CardContent
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "&:last-child": { p: 1 },
          }}
        >
          {canEdit && (
          <Box
            className="radio-icon"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleRadioClick}
            sx={{
              opacity: 0,
              transform: "scale(0.8)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              display: "flex",
              alignItems: "center",
              width: "24px",
            }}
          >
            <Tooltip title="Mark complete">
              <Checkbox
                size="small"
                checked={Boolean(card.completed)}
                onChange={handleToggleCompleted}
                onPointerDown={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<RadioButtonChecked />}
                sx={[completedRadioSx, { pointerEvents: "none" }]}
              />
            </Tooltip>
          </Box>
          )}

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
                marginLeft: "4px",
                border: "2px solid #0079bf",
                borderRadius: 1,
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          ) : (
            <Typography
              variant="body2"
              className="card-title"
              sx={{
                ml: 1,
                flexGrow: 1,
                transition: "transform 0.3s ease",
              }}
            >
              {card?.title}
            </Typography>
          )}

          {canEdit && (
            <CardMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onEditCard={handleEditCard}
              onOpenCard={handleOpenModal}
              onArchiveCard={handleArchiveCard}
              card={card}
            />
          )}
        </CardContent>

        {hasAnyActions && (
          <CardActions sx={{ pl: 2 }}>
            {hasDescription && (
              <Tooltip title="This card has a description">
                <Notes fontSize="small" />
              </Tooltip>
            )}
            {hasComments && (
              <Tooltip title="comments">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                  }}
                >
                  <MapsUgcRoundedIcon sx={{ width: 16, height: 16 }} />
                  <Typography variant="body2">
                    {card.comments?.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            {hasAttachments && (
              <Tooltip title="attachments">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                  }}
                >
                  <Attachment fontSize="small" />
                  <Typography variant="body2">
                    {card.attachments?.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            {hasDates && (
              <Tooltip title="dates">
                <Chip
                  icon={<Schedule sx={{ width: 14, height: 14 }} />}
                  label={dayjs(card.dueDate).format("DD/MM/YYYY") || dayjs(card.startDate).format("DD/MM/YYYY")}
                  size="small"
                  color={card.completed ? "success" : "default"}
                />
              </Tooltip>
            )}
            {hasChecklist && (
              <Tooltip title="checklist">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    minWidth: 72,
                    color: isChecklistCompleted
                      ? "success.main"
                      : "text.primary",
                  }}
                >
                  <TaskAlt fontSize="small" sx={{ color: "inherit" }} />
                  <Typography variant="body2">
                    {completedChecklistItems}/{checklistItems.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={checklistProgress}
                    color={isChecklistCompleted ? "success" : "primary"}
                    sx={{ width: 24, height: 6, borderRadius: 1 }}
                  />
                </Box>
              </Tooltip>
            )}
          </CardActions>
        )}
      </MuiCard>
      <CardModal
        open={openModal}
        onClose={handleCloseModal}
        card={card}
        canEdit={canEdit}
      />
    </>
  );
};

export default Card;
