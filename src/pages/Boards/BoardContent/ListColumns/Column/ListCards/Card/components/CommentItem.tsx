import React, { useState } from "react";
import { Avatar, Badge, Box, Typography, Button, Stack } from "@mui/material";
import { format } from "date-fns";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { HelperUtils } from "~/untils/helpers";
import DeleteConfirmMenu from "./DeleteConfirmMenu";

interface CommentItemProps {
  authorName: string;
  avatar: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  onUpdate: (newContent: string) => void;
  onDelete: () => void;
  canEdit?: boolean;
  isAuthorOnline?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  authorName,
  avatar,
  content,
  createdAt,
  updatedAt,
  onUpdate,
  onDelete,
  canEdit = true,
  isAuthorOnline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete();
    handleCloseMenu();
  };

  const handleSave = () => {
    if (editValue.trim() === "") return;
    onUpdate(editValue);
    setIsEditing(false);
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={{ xs: 1, sm: 2 }}
      mb={2}
      sx={{ minWidth: 0 }}
    >
      <Badge
        overlap="circular"
        variant="dot"
        color="success"
        invisible={!isAuthorOnline}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiBadge-dot": {
            width: 10,
            height: 10,
            minWidth: 10,
            border: "2px solid",
            borderColor: "background.paper",
            borderRadius: "50%",
          },
        }}
      >
        {avatar ? (
          <Avatar alt={authorName} src={avatar}></Avatar>
        ) : (
          <Avatar sx={{ bgcolor: "#f4a261", fontSize: "small" }}>
            {HelperUtils.getInitials(authorName)}
          </Avatar>
        )}
      </Badge>

      <Box flex={1} sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ overflowWrap: "anywhere" }}
        >
          {authorName}{" "}
          <Typography
            variant="caption"
            color="text.secondary"
            component="span"
            sx={{ display: { xs: "block", sm: "inline" } }}
          >
            {format(new Date(createdAt), "MMM dd, yyyy, h:mm a")}
            {!HelperUtils.isEmpty(updatedAt) && " (edited)"}
          </Typography>
        </Typography>
        {isEditing ? (
          <>
            <ReactQuill
              theme="snow"
              value={editValue}
              onChange={setEditValue}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              mt={1}
            >
              <Button onClick={handleSave} size="small" variant="contained">
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(content);
                }}
                size="small"
                variant="outlined"
              >
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                padding: 1,
                mt: 0.5,
                backgroundColor: "#fafafa",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              <Box
                sx={{
                  "& p": {
                    margin: 0,
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Box>
            {canEdit && (
           <Stack direction="row" spacing={2} mt={0.5}>
              <Button onClick={() => setIsEditing(true)} size="small">
                Edit
              </Button>
              <Button
                onClick={handleOpenMenu}
                size="small"
                variant="contained"
                color="error"
                sx={{ minHeight: 28, boxShadow: "none" }}
              >
                Delete
              </Button>
            </Stack>
            )}
          </>
        )}
      </Box>
      <DeleteConfirmMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onConfirm={handleDelete}
        label="comment"
        content="Deleting a comment is forever. There is no undo."
      />
    </Box>
  );
};

export default CommentItem;
