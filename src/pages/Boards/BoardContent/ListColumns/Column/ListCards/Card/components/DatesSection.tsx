import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Schedule } from "@mui/icons-material";
import { CardType } from "~/types/card";
import {
  formatDateDisplayValue,
  toDateInputValue,
} from "./CardModalSectionUtils";

interface DatesSectionProps {
  card: CardType;
  showDates: boolean;
  onChangeDate: (field: "startDate" | "dueDate", value: string) => void;
  onClearDates: () => void;
}

export function DatesSection({
  card,
  showDates,
  onChangeDate,
  onClearDates,
}: DatesSectionProps) {
  const startDateValue = toDateInputValue(card.startDate);
  const dueDateValue = toDateInputValue(card.dueDate);
  const hasInvalidDateRange =
    Boolean(startDateValue && dueDateValue) && startDateValue > dueDateValue;

  const handleDateChange = (
    field: "startDate" | "dueDate",
    value: string,
  ) => {
    if (field === "startDate" && dueDateValue && value > dueDateValue) return;
    if (field === "dueDate" && startDateValue && value < startDateValue) return;

    onChangeDate(field, value);
  };

  return (
    <>
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              label="Start date"
              type="date"
              size="small"
              value={startDateValue}
              onChange={(event) =>
                handleDateChange("startDate", event.target.value)
              }
              InputLabelProps={{ shrink: true }}
              error={hasInvalidDateRange}
              helperText={
                hasInvalidDateRange ? "Start date must be before due date" : " "
              }
              slotProps={{
                htmlInput: {
                  max: dueDateValue || undefined,
                },
              }}
              fullWidth
            />
            <TextField
              label="Due date"
              type="date"
              size="small"
              value={dueDateValue}
              onChange={(event) =>
                handleDateChange("dueDate", event.target.value)
              }
              InputLabelProps={{ shrink: true }}
              error={hasInvalidDateRange}
              helperText={
                hasInvalidDateRange ? "Due date must be after start date" : " "
              }
              slotProps={{
                htmlInput: {
                  min: startDateValue || undefined,
                },
              }}
              fullWidth
            />
            <Button onClick={onClearDates} sx={{ flexShrink: 0 }}>
              Clear
            </Button>
          </Stack>
        </Box>
      )}

      {(card.startDate || card.dueDate) && (
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {card.startDate && (
            <Chip
              icon={<Schedule />}
              label={`Start ${formatDateDisplayValue(card.startDate)}`}
              size="small"
              sx={{ maxWidth: "100%" }}
            />
          )}
          {card.dueDate && (
            <Chip
              icon={<Schedule />}
              color={card.completed ? "success" : "default"}
              label={`Due ${formatDateDisplayValue(card.dueDate)}`}
              size="small"
              sx={{ maxWidth: "100%" }}
            />
          )}
        </Stack>
      )}
    </>
  );
}
