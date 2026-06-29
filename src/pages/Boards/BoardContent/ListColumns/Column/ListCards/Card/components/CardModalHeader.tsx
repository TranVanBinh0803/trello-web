import type { MouseEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CloseRounded,
  ImageOutlined,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { CardType } from "~/types/card";

interface CardModalHeaderProps {
  card: CardType;
  canEdit: boolean;
  hasCover: boolean;
  isCoverColor: boolean | undefined;
  headerHeight: string;
  onClose: () => void;
  onOpenCoverMenu: (event: MouseEvent<HTMLElement>) => void;
}

export function CardModalHeader({
  card,
  canEdit,
  hasCover,
  isCoverColor,
  headerHeight,
  onClose,
  onOpenCoverMenu,
}: CardModalHeaderProps) {
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 2,
        paddingX: 2,
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        height: headerHeight,
        ...(hasCover && {
          background: isCoverColor ? card.cover : `url(${card.cover})`,
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
        disabled
      >
        {card.title}
      </Button>
      <Box display="flex" gap={0.5}>
        {canEdit && (
          <Tooltip title="Cover">
            <IconButton
              size="small"
              onClick={onOpenCoverMenu}
              sx={headerIconButtonStyle}
            >
              <ImageOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Close">
          <IconButton size="small" onClick={onClose} sx={headerIconButtonStyle}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
