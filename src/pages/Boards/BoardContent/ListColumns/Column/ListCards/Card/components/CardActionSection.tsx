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
      sx={{
        justifyContent: { xs: "stretch", sm: "center" },
        my: 1,
        "& .MuiButton-root": {
          flex: { xs: "1 1 calc(50% - 8px)", sm: "0 0 auto" },
          minWidth: { xs: 0, sm: 96 },
        },
      }}
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
