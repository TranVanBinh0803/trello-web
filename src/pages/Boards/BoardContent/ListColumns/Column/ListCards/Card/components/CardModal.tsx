import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Tooltip,
  Checkbox,
  IconButton,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  Add,
  Attachment,
  CheckCircle,
  CloseRounded,
  DeleteOutline,
  ImageOutlined,
  KeyboardArrowDownRounded,
  Label,
  MoreHorizOutlined,
  Notes,
  PersonAdd,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Schedule,
  TaskAlt,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import {
  CardLabelType,
  CardType,
  ChecklistItemType,
  ChecklistType,
} from "~/types/card";
import type { updateCardRequest } from "~/apis/services/card/Card";
import { HelperUtils } from "~/untils/helpers";
import { useUpdateCard } from "../api/useUpdateCard";
import AttachmentList from "./AttachmentList";
import CommentList from "./CommentList";
import CoverMenu from "./CoverMenu";

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
  canEdit?: boolean;
}

const LABEL_OPTIONS: CardLabelType[] = [
  { _id: "label-green", title: "Done", color: "#4bce97" },
  { _id: "label-yellow", title: "Priority", color: "#f5cd47" },
  { _id: "label-orange", title: "Design", color: "#fea362" },
  { _id: "label-red", title: "Bug", color: "#f87168" },
  { _id: "label-purple", title: "Review", color: "#9f8fef" },
  { _id: "label-blue", title: "Feature", color: "#579dff" },
];

const modalStyles: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  color: "text.primary",
  borderRadius: "8px",
  boxShadow: (theme) =>
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.55)"
      : "0 4px 20px rgba(0, 0, 0, 0.15)",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: 0,
  "& .ql-toolbar": {
    borderColor: "divider",
    bgcolor: "background.default",
  },
  "& .ql-container": {
    borderColor: "divider",
    color: "text.primary",
  },
  "& .ql-editor": {
    minHeight: 120,
    color: "text.primary",
  },
  "& .ql-stroke": {
    stroke: "text.primary",
  },
  "& .ql-fill": {
    fill: "text.primary",
  },
  "& .ql-picker": {
    color: "text.primary",
  },
};

const createLocalId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

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
  "&.Mui-checked::before": {
    content: '""',
    position: "absolute",
    inset: 6,
    borderRadius: "50%",
    border: `2px solid ${theme.palette.success.light}`,
    animation: "completedRadioPulse 900ms ease-out forwards",
  },
  "&.Mui-checked::after": {
    content: '""',
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: `conic-gradient(
      from 0deg,
      transparent 0deg 26deg,
      ${theme.palette.success.main} 26deg 34deg,
      transparent 34deg 70deg,
      ${theme.palette.success.main} 70deg 78deg,
      transparent 78deg 116deg,
      ${theme.palette.success.main} 116deg 124deg,
      transparent 124deg 160deg,
      ${theme.palette.success.main} 160deg 168deg,
      transparent 168deg 206deg,
      ${theme.palette.success.main} 206deg 214deg,
      transparent 214deg 250deg,
      ${theme.palette.success.main} 250deg 258deg,
      transparent 258deg 296deg,
      ${theme.palette.success.main} 296deg 304deg,
      transparent 304deg 340deg,
      ${theme.palette.success.main} 340deg 348deg,
      transparent 348deg 360deg
    )`,
    animation: "completedRadioSpark 900ms ease-out forwards",
    zIndex: 0,
  },
  "@keyframes completedRadioPulse": {
    "0%": { opacity: 0.8, transform: "scale(0.7)" },
    "100%": { opacity: 0, transform: "scale(1.9)" },
  },
  "@keyframes completedRadioSpark": {
    "0%": { opacity: 0.9, transform: "scale(0.55) rotate(0deg)" },
    "100%": { opacity: 0, transform: "scale(1.5) rotate(22deg)" },
  },
});

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const getChecklistProgress = (checklists: ChecklistType[] = []) => {
  const items = checklists.flatMap((checklist) => checklist.items);
  const completedItems = items.filter((item) => item.completed).length;
  const totalItems = items.length;
  return {
    completedItems,
    totalItems,
    value: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
  };
};

const CardModal = ({ open, onClose, card, canEdit = true }: CardModalProps) => {
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [localCard, setLocalCard] = useState<CardType>(card);
  const [showLabels, setShowLabels] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("Checklist");
  const [newChecklistItemTitle, setNewChecklistItemTitle] = useState("");

  const updateCardMutation = useUpdateCard(card._id);
  const labels = localCard.labels ?? [];
  const checklists = localCard.checklists ?? [];
  const checklistProgress = getChecklistProgress(checklists);
  const isChecklistCompleted =
    checklistProgress.totalItems > 0 &&
    checklistProgress.completedItems === checklistProgress.totalItems;

  const updateLocalCard = (payload: updateCardRequest) => {
    if (!canEdit) return;
    const previousCard = cloneDeep(localCard);
    setLocalCard((prev) => ({ ...prev, ...payload }));
    updateCardMutation.mutate(payload, {
      onSuccess: (response) => {
        setLocalCard(response.data);
      },
      onError: (error) => {
        setLocalCard(previousCard);
        setDescriptionValue(String(previousCard.description || ""));
        toast.error(error?.message || "Failed to update card");
      },
    });
  };

  const handleOpenCoverMenu = (event: MouseEvent<HTMLElement>) => {
    if (!canEdit) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCoverMenu = () => {
    setAnchorEl(null);
  };

  const handleAddDescription = () => {
    updateLocalCard({ description: descriptionValue });
    setIsOpenDescription(false);
  };

  const handleSetCover = (fileUrl: string) => {
    updateLocalCard({ cover: fileUrl });
  };

  const handleSetColorCover = (color: string) => {
    updateLocalCard({ cover: localCard.cover === color ? "" : color });
  };

  const handleSetLocalCard = (card: CardType) => {
    setLocalCard(card);
  };

  const handleToggleCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    updateLocalCard({ completed: event.target.checked });
  };

  const handleCompletedRadioClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    updateLocalCard({ completed: !Boolean(localCard.completed) });
  };

  const handleToggleLabel = (label: CardLabelType) => {
    const hasLabel = labels.some((item) => item._id === label._id);
    const nextLabels = hasLabel
      ? labels.filter((item) => item._id !== label._id)
      : [...labels, label];
    updateLocalCard({ labels: nextLabels });
  };

  const handleDateChange = (
    field: "startDate" | "dueDate",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    updateLocalCard({ [field]: event.target.value || null });
  };

  const handleClearDates = () => {
    updateLocalCard({ startDate: null, dueDate: null });
  };

  const handleAddChecklist = () => {
    const title = newChecklistTitle.trim();
    if (!title) return;

    const nextChecklists: ChecklistType[] = [
      ...checklists,
      {
        _id: createLocalId("checklist"),
        title,
        items: [],
        createdAt: Date.now(),
      },
    ];

    updateLocalCard({ checklists: nextChecklists });
    setShowChecklist(true);
    setNewChecklistTitle("Checklist");
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const title = newChecklistItemTitle.trim();
    if (!title) return;

    const nextChecklists = checklists.map((checklist) =>
      checklist._id === checklistId
        ? {
            ...checklist,
            items: [
              ...checklist.items,
              {
                _id: createLocalId("item"),
                title,
                completed: false,
                createdAt: Date.now(),
              },
            ],
          }
        : checklist,
    );

    updateLocalCard({ checklists: nextChecklists });
    setNewChecklistItemTitle("");
  };

  const handleToggleChecklistItem = (
    checklistId: string,
    itemId: string,
    completed: boolean,
  ) => {
    const nextChecklists = checklists.map((checklist) =>
      checklist._id === checklistId
        ? {
            ...checklist,
            items: checklist.items.map((item) =>
              item._id === itemId ? { ...item, completed } : item,
            ),
          }
        : checklist,
    );

    updateLocalCard({ checklists: nextChecklists });
  };

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    const nextChecklists = checklists.map((checklist) =>
      checklist._id === checklistId
        ? {
            ...checklist,
            items: checklist.items.filter((item) => item._id !== itemId),
          }
        : checklist,
    );

    updateLocalCard({ checklists: nextChecklists });
  };

  const handleDeleteChecklist = (checklistId: string) => {
    updateLocalCard({
      checklists: checklists.filter(
        (checklist) => checklist._id !== checklistId,
      ),
    });
  };

  const isCoverColor = localCard.cover?.startsWith("#");
  const hasCover = Boolean(localCard.cover && localCard.cover !== "");

  const getHeaderHeight = () => {
    if (!hasCover) return "58px";
    return isCoverColor ? "116px" : "160px";
  };

  const headerIconButtonStyle = {
    height: "30px",
    ...(hasCover && {
      backgroundColor: "rgba(37, 31, 31, 0.3)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    }),
  };

  useEffect(() => {
    setLocalCard(card);
    setDescriptionValue(String(card.description || ""));
  }, [card]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="card-modal-title"
        aria-describedby="card-modal-description"
        BackdropProps={{
          style: {
            userSelect: "none",
          },
        }}
      >
        <Box sx={modalStyles}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingTop: 2,
              paddingX: 2,
              borderBottom: "1px solid",
              borderBottomColor: "divider",
              height: getHeaderHeight(),
              ...(hasCover && {
                background: isCoverColor
                  ? localCard.cover
                  : `url(${localCard.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }),
            }}
          >
            <Button
              size="small"
              variant="contained"
              endIcon={<KeyboardArrowDownRounded />}
              disabled={true}
            >
              {localCard.title}
            </Button>
            <Box display="flex" gap={0.5}>
              {canEdit && (
                <Tooltip title="Cover">
                  <IconButton
                    size="small"
                    onClick={handleOpenCoverMenu}
                    sx={headerIconButtonStyle}
                  >
                    <ImageOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  onClick={onClose}
                  sx={headerIconButtonStyle}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography
            id="card-modal-description"
            sx={{ my: 2 }}
            component="div"
          >
            <Grid container spacing={2}>
              <Grid size={7} px={2}>
                <Box
                  sx={{
                    maxHeight: "65vh",
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title="Mark complete">
                      <Box
                        onPointerDown={(event) => event.stopPropagation()}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={canEdit ? handleCompletedRadioClick : undefined}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: canEdit ? "pointer" : "default",
                        }}
                      >
                        <Checkbox
                          checked={Boolean(localCard.completed)}
                          onChange={handleToggleCompleted}
                          disabled={!canEdit}
                          icon={<RadioButtonUnchecked />}
                          checkedIcon={<RadioButtonChecked />}
                          sx={[completedRadioSx, { pointerEvents: "none" }]}
                        />
                      </Box>
                    </Tooltip>
                    <Typography variant="body2">
                      {localCard.title}
                    </Typography>
                    {localCard.completed && (
                      <Chip
                        size="small"
                        icon={<CheckCircle />}
                        label="Complete"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>

                  {canEdit && (
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ justifyContent: "center", my: 1 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Label />}
                      onClick={() => setShowLabels((prev) => !prev)}
                    >
                      Labels
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Schedule />}
                      onClick={() => setShowDates((prev) => !prev)}
                    >
                      Dates
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TaskAlt />}
                      onClick={() => setShowChecklist((prev) => !prev)}
                    >
                      Checklist
                    </Button>
                  </Stack>
                  )}

                  {labels.length > 0 && (
                    <Stack
                      direction="row"
                      gap={1}
                      flexWrap="wrap"
                      sx={{ my: 1 }}
                    >
                      {labels.map((label) => (
                        <Chip
                          key={label._id}
                          label={label.title || "Label"}
                          size="small"
                          sx={{
                            backgroundColor: label.color,
                            color: "#172b4d",
                            fontWeight: 700,
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {showLabels && (
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Labels
                      </Typography>
                      <Stack gap={1}>
                        {LABEL_OPTIONS.map((label) => {
                          const selected = labels.some(
                            (item) => item._id === label._id,
                          );
                          return (
                            <Button
                              key={label._id}
                              variant={selected ? "contained" : "outlined"}
                              onClick={() => handleToggleLabel(label)}
                              sx={{
                                justifyContent: "flex-start",
                                backgroundColor: selected
                                  ? label.color
                                  : "background.paper",
                                color: selected ? "#172b4d" : "text.primary",
                                borderColor: label.color,
                                "&:hover": {
                                  backgroundColor: label.color,
                                  color: "#172b4d",
                                },
                              }}
                            >
                              {label.title}
                            </Button>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}

                  {showDates && (
                    <Box
                      sx={{
                        p: 1,
                        mt: 1,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Dates
                      </Typography>
                      <Stack direction="row" gap={1} alignItems="center">
                        <TextField
                          label="Start date"
                          type="date"
                          size="small"
                          value={toDateInputValue(localCard.startDate)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleDateChange("startDate", event)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Due date"
                          type="date"
                          size="small"
                          value={toDateInputValue(localCard.dueDate)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleDateChange("dueDate", event)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <Button onClick={handleClearDates}>Clear</Button>
                      </Stack>
                    </Box>
                  )}

                  {(localCard.startDate || localCard.dueDate) && (
                    <Stack direction="row" gap={1} sx={{ mt: 1 }}>
                      {localCard.startDate && (
                        <Chip
                          icon={<Schedule />}
                          label={`Start ${toDateInputValue(localCard.startDate)}`}
                          size="small"
                        />
                      )}
                      {localCard.dueDate && (
                        <Chip
                          icon={<Schedule />}
                          color={localCard.completed ? "success" : "default"}
                          label={`Due ${toDateInputValue(localCard.dueDate)}`}
                          size="small"
                        />
                      )}
                    </Stack>
                  )}

                  {showChecklist && (
                    <Box
                      sx={{
                        p: 1,
                        mt: 1,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Add checklist
                      </Typography>
                      <Stack direction="row" gap={1}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Checklist title"
                          value={newChecklistTitle}
                          onChange={(event) =>
                            setNewChecklistTitle(event.target.value)
                          }
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddChecklist}
                        >
                          Add
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {checklists.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        sx={{
                          color: isChecklistCompleted
                            ? "success.main"
                            : "text.primary",
                        }}
                      >
                        <TaskAlt fontSize="small" sx={{ color: "inherit" }} />
                        <Typography variant="body2">Checklist</Typography>
                        <Typography variant="caption" color="text.primary">
                          {checklistProgress.completedItems}/
                          {checklistProgress.totalItems}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={checklistProgress.value}
                        color={isChecklistCompleted ? "success" : "primary"}
                        sx={{ my: 1, height: 8, borderRadius: 1 }}
                      />
                      <Stack gap={2}>
                        {checklists.map((checklist) => {
                          const isCurrentChecklistCompleted =
                            checklist.items.length > 0 &&
                            checklist.items.every((item) => item.completed);

                          return (
                          <Box
                            key={checklist._id}
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: isCurrentChecklistCompleted
                                ? "success.light"
                                : "transparent",
                              bgcolor: isCurrentChecklistCompleted
                                ? "success.50"
                                : "background.default",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography
                                fontWeight={600}
                                color={
                                  isCurrentChecklistCompleted
                                    ? "success.main"
                                    : "text.primary"
                                }
                              >
                                {checklist.title}
                              </Typography>
                              {canEdit && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeleteChecklist(checklist._id)
                                }
                                sx={{
                                  bgcolor: "error.main",
                                  color: "error.contrastText",
                                  "&:hover": {
                                    bgcolor: "error.dark",
                                  },
                                }}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                              )}
                            </Stack>
                            <Stack gap={0.5}>
                              {checklist.items.map(
                                (item: ChecklistItemType) => (
                                  <Stack
                                    key={item._id}
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <Checkbox
                                      size="small"
                                      checked={item.completed}
                                      disabled={!canEdit}
                                      color={
                                        isCurrentChecklistCompleted
                                          ? "success"
                                          : "primary"
                                      }
                                      onChange={(event) =>
                                        handleToggleChecklistItem(
                                          checklist._id,
                                          item._id,
                                          event.target.checked,
                                        )
                                      }
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        flex: 1,
                                        color: isCurrentChecklistCompleted
                                          ? "success.main"
                                          : "text.primary",
                                        textDecoration: item.completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      {item.title}
                                    </Typography>
                                    {canEdit && (
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteChecklistItem(
                                          checklist._id,
                                          item._id,
                                        )
                                      }
                                      sx={{
                                        bgcolor: "error.main",
                                        color: "error.contrastText",
                                        "&:hover": {
                                          bgcolor: "error.dark",
                                        },
                                      }}
                                    >
                                      <DeleteOutline fontSize="small" />
                                    </IconButton>
                                    )}
                                  </Stack>
                                ),
                              )}
                            </Stack>
                            {canEdit && (
                            <Stack direction="row" gap={1} sx={{ mt: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Add an item"
                                value={newChecklistItemTitle}
                                onChange={(event) =>
                                  setNewChecklistItemTitle(event.target.value)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleAddChecklistItem(checklist._id);
                                  }
                                }}
                              />
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleAddChecklistItem(checklist._id)
                                }
                              >
                                Add
                              </Button>
                            </Stack>
                            )}
                            <Divider sx={{ mt: 2 }} />
                          </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        marginLeft: 1,
                      }}
                    >
                      <Notes fontSize="small" />
                      <Typography variant="body2">Description</Typography>
                    </Box>
                    {canEdit && !HelperUtils.isEmpty(localCard.description) && (
                      <Button
                        variant="outlined"
                        onClick={() => setIsOpenDescription(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                  <Box mt={1}>
                    {!isOpenDescription ? (
                      <Box ml={1}>
                        <Box
                          sx={{
                            color: "text.primary",
                            "& p": { color: "text.primary" },
                            "& span": { color: "text.primary" },
                            "& li": { color: "text.primary" },
                          }}
                          dangerouslySetInnerHTML={{
                            __html: localCard.description || "",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <ReactQuill
                          theme="snow"
                          value={descriptionValue}
                          onChange={setDescriptionValue}
                        />
                        <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleAddDescription}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setIsOpenDescription(false)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  {canEdit && HelperUtils.isEmpty(localCard.description) && (
                    <Button
                      variant="outlined"
                      sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        mt: 1,
                      }}
                      onClick={() => setIsOpenDescription(true)}
                    >
                      Add a more detailed description...
                    </Button>
                  )}
                  {!HelperUtils.isEmpty(localCard.attachments) && (
                    <AttachmentList
                      card={localCard}
                      attachments={localCard?.attachments ?? []}
                      onCardChange={handleSetLocalCard}
                      canEdit={canEdit}
                    />
                  )}
                </Box>
              </Grid>
              <Grid size={5}>
                <Box
                  sx={{
                    maxHeight: "65vh",
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <CommentList
                    card={localCard}
                    comments={localCard?.comments ?? []}
                    activities={localCard?.activities ?? []}
                    onCardChange={handleSetLocalCard}
                    canEdit={canEdit}
                  />
                </Box>
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Modal>
      <CoverMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseCoverMenu}
        onSetCover={handleSetCover}
        onSetColorCover={handleSetColorCover}
        onSetLocalCard={handleSetLocalCard}
        card={localCard}
        canEdit={canEdit}
      />
    </>
  );
};

export default CardModal;
