import type { ChangeEvent, MouseEvent } from "react";
import {
  Box,
  Checkbox,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { CardType } from "~/types/card";
import { completedRadioSx } from "./CardModalSectionUtils";

interface CardTitleSectionProps {
  card: CardType;
  canEdit: boolean;
  onCompletedChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCompletedClick: (event: MouseEvent<HTMLElement>) => void;
}

export function CardTitleSection({
  card,
  canEdit,
  onCompletedChange,
  onCompletedClick,
}: CardTitleSectionProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0.5,
        minWidth: 0,
      }}
    >
      <Tooltip title="Mark complete">
        <Box
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={canEdit ? onCompletedClick : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: canEdit ? "pointer" : "default",
          }}
        >
          <Checkbox
            checked={Boolean(card.completed)}
            onChange={onCompletedChange}
            disabled={!canEdit}
            icon={<RadioButtonUnchecked />}
            checkedIcon={<RadioButtonChecked />}
            sx={[completedRadioSx, { pointerEvents: "none" }]}
          />
        </Box>
      </Tooltip>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          overflowWrap: "anywhere",
          pt: 1.25,
        }}
      >
        {card.title}
      </Typography>
      {card.completed && (
        <Chip
          size="small"
          icon={<CheckCircle />}
          label="Complete"
          color="success"
          sx={{ ml: { xs: 0, sm: 1 }, mt: 0.75, flexShrink: 0 }}
        />
      )}
    </Box>
  );
}
