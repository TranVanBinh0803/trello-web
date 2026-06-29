import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { CardLabelType } from "~/types/card";
import { LABEL_OPTIONS } from "./CardModalSectionUtils";

interface LabelsSectionProps {
  labels: CardLabelType[];
  showLabels: boolean;
  onToggleLabel: (label: CardLabelType) => void;
}

export function LabelsSection({
  labels,
  showLabels,
  onToggleLabel,
}: LabelsSectionProps) {
  return (
    <>
      {labels.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ my: 1 }}>
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
              const selected = labels.some((item) => item._id === label._id);
              return (
                <Button
                  key={label._id}
                  variant={selected ? "contained" : "outlined"}
                  onClick={() => onToggleLabel(label)}
                  sx={{
                    justifyContent: "flex-start",
                    backgroundColor: selected ? label.color : "background.paper",
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
    </>
  );
}
