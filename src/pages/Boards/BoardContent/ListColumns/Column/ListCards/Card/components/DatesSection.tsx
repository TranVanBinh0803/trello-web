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
import { toDateInputValue } from "./CardModalSectionUtils";

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
          <Stack direction="row" gap={1} alignItems="center">
            <TextField
              label="Start date"
              type="date"
              size="small"
              value={toDateInputValue(card.startDate)}
              onChange={(event) => onChangeDate("startDate", event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Due date"
              type="date"
              size="small"
              value={toDateInputValue(card.dueDate)}
              onChange={(event) => onChangeDate("dueDate", event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button onClick={onClearDates}>Clear</Button>
          </Stack>
        </Box>
      )}

      {(card.startDate || card.dueDate) && (
        <Stack direction="row" gap={1} sx={{ mt: 1 }}>
          {card.startDate && (
            <Chip
              icon={<Schedule />}
              label={`Start ${toDateInputValue(card.startDate)}`}
              size="small"
            />
          )}
          {card.dueDate && (
            <Chip
              icon={<Schedule />}
              color={card.completed ? "success" : "default"}
              label={`Due ${toDateInputValue(card.dueDate)}`}
              size="small"
            />
          )}
        </Stack>
      )}
    </>
  );
}
