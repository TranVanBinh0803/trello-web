import {
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteConfirmMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  label: string;
  content: string;
}

const DeleteConfirmMenu: React.FC<DeleteConfirmMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onConfirm,
  label,
  content
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 2,
          maxWidth: 300,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography fontWeight={600} fontSize={14}>
          Delete {label}?
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {content}
      </Typography>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={onConfirm}
      >
        Delete {label}
      </Button>
    </Popover>
  );
};

export default DeleteConfirmMenu;
