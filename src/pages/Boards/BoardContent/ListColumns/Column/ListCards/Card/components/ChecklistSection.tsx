import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutline, TaskAlt } from "@mui/icons-material";
import { ChecklistItemType, ChecklistType } from "~/types/card";
import { getChecklistProgress } from "./CardModalSectionUtils";

interface ChecklistSectionProps {
  checklists: ChecklistType[];
  showChecklist: boolean;
  canEdit: boolean;
  onAddChecklist: (title: string) => void;
  onAddChecklistItem: (checklistId: string, title: string) => void;
  onToggleChecklistItem: (
    checklistId: string,
    itemId: string,
    completed: boolean,
  ) => void;
  onDeleteChecklistItem: (checklistId: string, itemId: string) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

export function ChecklistSection({
  checklists,
  showChecklist,
  canEdit,
  onAddChecklist,
  onAddChecklistItem,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onDeleteChecklist,
}: ChecklistSectionProps) {
  const [newChecklistTitle, setNewChecklistTitle] = useState("Checklist");
  const [newChecklistItemTitles, setNewChecklistItemTitles] = useState<
    Record<string, string>
  >({});
  const checklistProgress = getChecklistProgress(checklists);
  const isChecklistCompleted =
    checklistProgress.totalItems > 0 &&
    checklistProgress.completedItems === checklistProgress.totalItems;

  const handleAddChecklist = () => {
    const title = newChecklistTitle.trim();
    if (!title) return;

    onAddChecklist(title);
    setNewChecklistTitle("Checklist");
  };

  const handleChangeChecklistItemTitle = (
    checklistId: string,
    title: string,
  ) => {
    setNewChecklistItemTitles((prev) => ({
      ...prev,
      [checklistId]: title,
    }));
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const title = newChecklistItemTitles[checklistId]?.trim();
    if (!title) return;

    onAddChecklistItem(checklistId, title);
    setNewChecklistItemTitles((prev) => ({
      ...prev,
      [checklistId]: "",
    }));
  };

  return (
    <>
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
          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <TextField
              size="small"
              fullWidth
              label="Checklist title"
              value={newChecklistTitle}
              onChange={(event) => setNewChecklistTitle(event.target.value)}
            />
            <Button variant="contained" onClick={handleAddChecklist}>
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
              color: isChecklistCompleted ? "success.main" : "text.primary",
            }}
          >
            <TaskAlt fontSize="small" sx={{ color: "inherit" }} />
            <Typography variant="body2">Checklist</Typography>
            <Typography variant="caption" color="text.primary">
              {checklistProgress.completedItems}/{checklistProgress.totalItems}
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
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={1}
                  >
                    <Typography
                      fontWeight={600}
                      color={
                        isCurrentChecklistCompleted
                          ? "success.main"
                          : "text.primary"
                      }
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {checklist.title}
                    </Typography>
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onDeleteChecklist(checklist._id)}
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
                    {checklist.items.map((item: ChecklistItemType) => (
                      <Stack
                        key={item._id}
                        direction="row"
                        alignItems="flex-start"
                        gap={1}
                      >
                        <Checkbox
                          size="small"
                          checked={item.completed}
                          disabled={!canEdit}
                          color={
                            isCurrentChecklistCompleted ? "success" : "primary"
                          }
                          onChange={(event) =>
                            onToggleChecklistItem(
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
                            minWidth: 0,
                            overflowWrap: "anywhere",
                            pt: 0.75,
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
                              onDeleteChecklistItem(checklist._id, item._id)
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
                    ))}
                  </Stack>
                  {canEdit && (
                    <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ mt: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Add an item"
                        value={newChecklistItemTitles[checklist._id] ?? ""}
                        onChange={(event) =>
                          handleChangeChecklistItemTitle(
                            checklist._id,
                            event.target.value,
                          )
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
                        onClick={() => handleAddChecklistItem(checklist._id)}
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
    </>
  );
}
