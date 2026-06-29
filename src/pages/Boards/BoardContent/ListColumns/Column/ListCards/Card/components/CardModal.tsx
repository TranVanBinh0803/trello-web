import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { Box, Grid, Modal, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import "react-quill-new/dist/quill.snow.css";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import {
  CardLabelType,
  CardType,
  ChecklistType,
} from "~/types/card";
import type { updateCardRequest } from "~/apis/services/card/Card";
import { HelperUtils } from "~/untils/helpers";
import { useUpdateCard } from "../api/useUpdateCard";
import AttachmentList from "./AttachmentList";
import CommentList from "./CommentList";
import CoverMenu from "./CoverMenu";
import {
  CardActionSection,
  CardModalHeader,
  CardTitleSection,
  ChecklistSection,
  DatesSection,
  DescriptionSection,
  LabelsSection,
} from "./CardModalSections";

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
  canEdit?: boolean;
}

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

type CardModalPanel = "labels" | "dates" | "checklist" | null;

const CardModal = ({ open, onClose, card, canEdit = true }: CardModalProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [localCard, setLocalCard] = useState<CardType>(card);
  const [activePanel, setActivePanel] = useState<CardModalPanel>(null);

  const updateCardMutation = useUpdateCard(card._id);
  const labels = localCard.labels ?? [];
  const checklists = localCard.checklists ?? [];
  const isCoverColor = localCard.cover?.startsWith("#");
  const hasCover = Boolean(localCard.cover && localCard.cover !== "");

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
        toast.error(error?.message || "Failed to update card");
      },
    });
  };

  const getHeaderHeight = () => {
    if (!hasCover) return "58px";
    return isCoverColor ? "116px" : "160px";
  };

  const handleOpenCoverMenu = (event: MouseEvent<HTMLElement>) => {
    if (!canEdit) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCoverMenu = () => {
    setAnchorEl(null);
  };

  const handleSaveDescription = (description: string) => {
    updateLocalCard({ description });
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
    value: string,
  ) => {
    updateLocalCard({ [field]: value || null });
  };

  const handleClearDates = () => {
    updateLocalCard({ startDate: null, dueDate: null });
  };

  const handleAddChecklist = (title: string) => {
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
    setActivePanel("checklist");
  };

  const handleAddChecklistItem = (checklistId: string, title: string) => {
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

  useEffect(() => {
    setLocalCard(card);
  }, [card]);

  const togglePanel = (panel: Exclude<CardModalPanel, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

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
          <CardModalHeader
            card={localCard}
            canEdit={canEdit}
            hasCover={hasCover}
            isCoverColor={isCoverColor}
            headerHeight={getHeaderHeight()}
            onClose={onClose}
            onOpenCoverMenu={handleOpenCoverMenu}
          />
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
                  <CardTitleSection
                    card={localCard}
                    canEdit={canEdit}
                    onCompletedChange={handleToggleCompleted}
                    onCompletedClick={handleCompletedRadioClick}
                  />

                  <CardActionSection
                    canEdit={canEdit}
                    onToggleLabels={() => togglePanel("labels")}
                    onToggleDates={() => togglePanel("dates")}
                    onToggleChecklist={() => togglePanel("checklist")}
                  />

                  <LabelsSection
                    labels={labels}
                    showLabels={activePanel === "labels"}
                    onToggleLabel={handleToggleLabel}
                  />

                  <DatesSection
                    card={localCard}
                    showDates={activePanel === "dates"}
                    onChangeDate={handleDateChange}
                    onClearDates={handleClearDates}
                  />

                  <ChecklistSection
                    checklists={checklists}
                    showChecklist={activePanel === "checklist"}
                    canEdit={canEdit}
                    onAddChecklist={handleAddChecklist}
                    onAddChecklistItem={handleAddChecklistItem}
                    onToggleChecklistItem={handleToggleChecklistItem}
                    onDeleteChecklistItem={handleDeleteChecklistItem}
                    onDeleteChecklist={handleDeleteChecklist}
                  />

                  <DescriptionSection
                    description={localCard.description}
                    canEdit={canEdit}
                    onSaveDescription={handleSaveDescription}
                  />

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
