import {
  Box,
  Typography,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { HelperUtils } from "~/untils/helpers";
import { AttachmentType } from "~/types/card";
import { format } from "date-fns";
import { useState, MouseEvent } from "react";
import UpdateFileNameMenu from "./UpdateFileNameMenu";
import DeleteConfirmMenu from "./DeleteConfirmMenu";

interface AttachmentItemProps extends AttachmentType {
  onUpdate: (updatedContent: string) => void;
  onDelete: (attachmentId: string) => void;
  canEdit?: boolean;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  _id,
  fileName,
  fileUrl,
  createdAt,
  updatedAt,
  onUpdate,
  onDelete,
  canEdit = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [updateAnchorEl, setUpdateAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const openUpdateMenu = Boolean(updateAnchorEl);
  const [localFileName, setLocalFileName] = useState(fileName);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!canEdit) return;
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUpdateMenu = (event: MouseEvent<HTMLElement>) => {
    setUpdateAnchorEl(event.currentTarget);
    handleClose();
  };

  const handleCloseUpdateMenu = () => {
    setUpdateAnchorEl(null);
  };

  const handleOpenDeleteMenu = (event: React.MouseEvent<HTMLElement>) => {
    setDeleteAnchorEl(event.currentTarget);
  };

  const handleCloseDeleteMenu = () => {
    setDeleteAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(_id);
    handleCloseDeleteMenu();
  };

  const handleConfirmUpdate = (newFileName: string) => {
    onUpdate(newFileName);
    setLocalFileName(newFileName);
    handleCloseUpdateMenu();
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = localFileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    handleClose();
  };

  const handleOpenFile = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "#f4f5f7",
        },
        px: 1,
        py: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            backgroundColor: "#e7e9ec",
            color: "#172b4d",
            borderRadius: 1,
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          {HelperUtils.getFileType(fileUrl).toUpperCase()}
        </Box>
        <Box>
          <Typography
            fontWeight={500}
            sx={{
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleOpenFile}
          >
            {localFileName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(createdAt), "MMM dd, yyyy, h:mm a")}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1}>
        <IconButton onClick={handleOpenFile} title="Open file">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
        {canEdit && (
        <IconButton>
          <MoreVertIcon
            sx={{ color: "text.primary", cursor: "pointer" }}
            id="basic-attachment-dropdown"
            aria-controls={open ? "basic-menu-attachment-dropdown" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
        </IconButton>
        )}

        <Menu
          id="basic-menu-attachment-dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            root: {
              "aria-labelledby": "basic-attachment-dropdown",
            },
          }}
        >
          <MenuItem onClick={handleOpenUpdateMenu}>
            <ListItemText>
              <Box>Edit</Box>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownload}>
            <ListItemText>
              <Box>Download</Box>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemText>
              <Box>Remove cover</Box>
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleOpenDeleteMenu}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 1,
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <ListItemText>
              <Box>Delete</Box>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Stack>

      <UpdateFileNameMenu
        anchorEl={updateAnchorEl}
        openUpdateMenu={openUpdateMenu}
        onCloseUpdateMenu={handleCloseUpdateMenu}
        onConfirm={handleConfirmUpdate}
        fileName={localFileName}
      />
      <DeleteConfirmMenu
        anchorEl={deleteAnchorEl}
        open={Boolean(deleteAnchorEl)}
        onClose={handleCloseDeleteMenu}
        onConfirm={handleDelete}
        label="attachment"
        content="Remove this attachment? There is no undo."
      />
    </Box>
  );
};

export default AttachmentItem;
