import {
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ArrowBack } from "@mui/icons-material";
import { useState, useEffect } from "react";

interface UpdateFileNameMenuProps {
  anchorEl: HTMLElement | null;
  openUpdateMenu: boolean;
  onCloseUpdateMenu: () => void;
  onConfirm: (newFileName: string) => void;
  fileName: string;
}

const UpdateFileNameMenu: React.FC<UpdateFileNameMenuProps> = ({
  anchorEl,
  openUpdateMenu,
  onCloseUpdateMenu,
  onConfirm,
  fileName,
}) => {
  const [newFileName, setNewFileName] = useState(fileName);
  const [error, setError] = useState<string>("");
  const [anchorPosition, setAnchorPosition] = useState<
    { top: number; left: number } | undefined
  >();

  useEffect(() => {
    if (openUpdateMenu) {
      setNewFileName(fileName);
      setError("");

      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        setAnchorPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [openUpdateMenu, fileName, anchorEl]);

  const handleConfirm = () => {
    const trimmedFileName = newFileName.trim();

    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedFileName)) {
      setError("File name contains invalid characters");
      return;
    }

    onConfirm(trimmedFileName);
    onCloseUpdateMenu();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Popover
      open={openUpdateMenu}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={onCloseUpdateMenu}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
      disableRestoreFocus={true}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 2,
          width: 300,
          maxWidth: 300,
          minHeight: 180,
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
        <IconButton size="small" onClick={onCloseUpdateMenu}>
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography fontWeight={600} fontSize={14}>
          Edit attachment
        </Typography>
        <IconButton size="small" onClick={onCloseUpdateMenu}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        File name
      </Typography>

      <TextField
        id="outlined-basic"
        sx={{
          width: "100%",
          my: 1,
          "& .MuiInputBase-root": {
            minHeight: 56,
          },
        }}
        value={newFileName}
        onChange={(e) => {
          setNewFileName(e.target.value);
          if (error) setError("");
        }}
        onKeyDown={handleKeyPress}
        variant="outlined"
        error={!!error}
        helperText={error}
        placeholder="Enter file name"
        autoFocus
      />

      <Button
        variant="contained"
        color="info"
        sx={{ width: "100%" }}
        onClick={handleConfirm}
        disabled={!newFileName.trim() || newFileName.trim() === fileName}
      >
        Update
      </Button>
    </Popover>
  );
};

export default UpdateFileNameMenu;
