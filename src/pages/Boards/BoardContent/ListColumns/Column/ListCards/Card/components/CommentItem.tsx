import React, { useState } from "react";
import { Avatar, Box, Typography, Button, Stack } from "@mui/material";
import { format } from "date-fns";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface CommentItemProps {
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const CommentItem: React.FC<CommentItemProps> = ({
  authorName,
  content,
  createdAt,
  updatedAt,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {};

  return (
    <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
      <Avatar sx={{ bgcolor: "#f4a261", fontSize: "small" }}>
        {getInitials(authorName)}
      </Avatar>
      <Box flex={1}>
        <Typography variant="subtitle2" fontWeight={600}>
          {authorName}{" "}
          <Typography variant="caption" color="text.secondary" component="span">
            {format(new Date(createdAt), "MMM dd, yyyy, h:mm a")}
            {updatedAt !== createdAt && " (edited)"}
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
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Box>
            <Stack direction="row" spacing={2} mt={0.5}>
              <Button onClick={() => setIsEditing(true)} size="small">
                Edit
              </Button>
              <Button onClick={handleDelete} size="small">
                Delete
              </Button>
            </Stack>
          </>
        )}
        {/* {!isEditing && (
          
        )} */}
      </Box>
    </Box>
  );
};

export default CommentItem;
