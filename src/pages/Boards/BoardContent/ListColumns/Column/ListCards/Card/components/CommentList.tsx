import { Box, Button, Typography } from "@mui/material";
import CommentItem from "./CommentItem";
import { ChatOutlined } from "@mui/icons-material";
import { useState } from "react";
import ReactQuill from "react-quill-new";

interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentListProps {
  comments: CommentItem[];
}

export const mockCommentList: CommentItem[] = [
  {
    id: "1",
    authorName: "Trần Văn Bình",
    content: "Comment edit",
    createdAt: "2025-05-26T15:00:00Z",
    updatedAt: "2025-05-26T14:00:00Z",
  },
  {
    id: "2",
    authorName: "Lê Thị Hoa",
    content: "Looks good to me!",
    createdAt: "2025-05-26T14:00:00Z",
    updatedAt: "2025-05-26T14:00:00Z",
  },
];

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const [value, setValue] = useState("<p>Hello <strong>world</strong></p>");
  const [isAddComment, setIsAddComment] = useState(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: 1,
          }}
        >
          <ChatOutlined fontSize="small" />
          <Typography variant="body2">Comments and activity</Typography>
        </Box>
        <Button variant="outlined">Show Details</Button>
      </Box>
      {!isAddComment && (
        <Button
          variant="outlined"
          sx={{ width: "100%", justifyContent: "flex-start", mt: 1 }}
          onClick={() => setIsAddComment(true)}
        >
          White a comment...
        </Button>
      )}
      <Box mt={1}>
        {isAddComment && (
          <Box mb={1}>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
            <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
              <Button variant="contained">Save</Button>
              <Button variant="outlined" onClick={() => setIsAddComment(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          authorName={comment.authorName}
          content={comment.content}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
        />
      ))}
    </Box>
  );
};

export default CommentList;
