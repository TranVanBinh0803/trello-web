import React, { useState } from "react";
import {
  Popover,
  Box,
  IconButton,
  Typography,
  Button,
  Grid,
  Divider,
  Tooltip,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { CardType } from "~/types/card";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import { useAddAttachment } from "../api/useAddAttachment";

interface CoverMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSetCover: (fileUrl: string) => void;
  onSetColorCover: (color: string) => void;
  onSetLocalCard: (card: CardType) => void;
  card: CardType;
  canEdit?: boolean;
}

// Predefined colors
const colors = [
  "#4bce97", // Green
  "#f5cd47", // Amber
  "#fea362", // Orange
  "#f87168", // Red
  "#9f8fef", // Purple
  "#579dff", // Blue
  "#6cc3e0", // Cyan
  "#94c748", // Light Green
  "#e774bb", // Pink
  "#8590a2", // Blue Grey
];

const CoverMenu: React.FC<CoverMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSetCover,
  onSetColorCover,
  onSetLocalCard,
  card,
  canEdit = true,
}) => {
  const addAttachmentMutation = useAddAttachment(card._id);
  const [localCard, setLocalCard] = useState<CardType>(card);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) {
      return;
    }
    addAttachmentMutation.mutate(
      { file },
      {
        onSuccess: (response) => {
          setLocalCard(response.data);
          onSetLocalCard(response.data);
        },
      }
    );
  };

  const handleColorSelect = (color: string) => {
    if (!canEdit) return;
    onSetColorCover(color);
  };

  const handleAttachmentSelect = (fileUrl: string) => {
    if (!canEdit) return;
    onSetCover(fileUrl);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 2,
          width: 300,
          maxWidth: 300,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography fontWeight={600} fontSize={14}>
          Cover
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}></Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Colors
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
          }}
        >
          {colors.map((color) => (
            <Tooltip title={color} key={color}>
              <Box
                onClick={() => handleColorSelect(color)}
                sx={{
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Attachments
        </Typography>

        {localCard.attachments && localCard.attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <ImageList sx={{ height: 48, width: "auto" }} cols={3} gap={4}>
              {localCard.attachments.map((attachment) => (
                <ImageListItem
                  key={attachment.fileUrl}
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleAttachmentSelect(attachment.fileUrl)}
                >
                  <img
                    src={`${attachment.fileUrl}?w=161&fit=crop&auto=format`}
                    alt={attachment.fileName}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "48px",
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: "4px",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="cover-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="cover-upload">
          <Button
            variant="outlined"
            fullWidth
            component="span"
            startIcon={<UploadIcon />}
            sx={{ py: 1.5 }}
          >
            Upload a cover image
          </Button>
        </label>
      </Box>

      <Divider sx={{ my: 2 }} />
    </Popover>
  );
};

export default CoverMenu;
