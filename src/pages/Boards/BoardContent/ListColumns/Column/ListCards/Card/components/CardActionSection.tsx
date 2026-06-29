import { Button, Stack } from "@mui/material";
import { Label, Schedule, TaskAlt } from "@mui/icons-material";

interface CardActionSectionProps {
  canEdit: boolean;
  onToggleLabels: () => void;
  onToggleDates: () => void;
  onToggleChecklist: () => void;
}

export function CardActionSection({
  canEdit,
  onToggleLabels,
  onToggleDates,
  onToggleChecklist,
}: CardActionSectionProps) {
  if (!canEdit) return null;

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      sx={{ justifyContent: "center", my: 1 }}
    >
      <Button variant="outlined" startIcon={<Label />} onClick={onToggleLabels}>
        Labels
      </Button>
      <Button variant="outlined" startIcon={<Schedule />} onClick={onToggleDates}>
        Dates
      </Button>
      <Button
        variant="outlined"
        startIcon={<TaskAlt />}
        onClick={onToggleChecklist}
      >
        Checklist
      </Button>
    </Stack>
  );
}
