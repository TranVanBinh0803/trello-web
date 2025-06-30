import React, { useState } from "react";
import { Avatar, Box, Typography, Button, Stack } from "@mui/material";
import { format } from "date-fns";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { HelperUtils } from "~/untils/helpers";

interface CommentItemProps {
  authorName: string;
  avatar: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  onUpdate: (newContent: string) => void;
  onDelete: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  authorName,
  avatar,
  content,
  createdAt,
  updatedAt,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleSave = () => {
    if (editValue.trim() === "") return;
    onUpdate(editValue);
    setIsEditing(false);
  };

  return (
    <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
      {avatar ? (
        <Avatar alt={avatar} src={avatar}></Avatar>
      ) : (
        <Avatar sx={{ bgcolor: "#f4a261", fontSize: "small" }}>
          {HelperUtils.getInitials(authorName)}
        </Avatar>
      )}

      <Box flex={1}>
        <Typography variant="subtitle2" fontWeight={600}>
          {authorName}{" "}
          <Typography variant="caption" color="text.secondary" component="span">
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
            <Stack direction="row" spacing={2} mt={1}>
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
              }}
            >
              <Box
                sx={{
                  "& p": {
                    margin: 0,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Box>
            <Stack direction="row" spacing={2} mt={0.5}>
              <Button onClick={() => setIsEditing(true)} size="small">
                Edit
              </Button>
              <Button onClick={onDelete} size="small">
                Delete
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
