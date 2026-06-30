import { Box, Button, Typography } from "@mui/material";
import { ChatOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import { ActivityType, CardType, CommentType } from "~/types/card";
import { useAtomValue } from "jotai";
import { user } from "~/atoms/AuthAtoms";
import { useAddComment } from "../api/useAddComment";
import CommentItem from "./CommentItem";
import { addCommentRequest } from "~/apis/services/card/Card";
import { useUpdateComment } from "../api/useUpdateComment";
import { useDeleteComment } from "../api/useDeleteComment";
import ActivityItem from "./ActivityItem";

interface CommentListProps {
  comments: CommentType[];
  activities: ActivityType[];
  card: CardType;
  onCardChange: (card: CardType) => void;
  canEdit?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  card,
  comments,
  activities,
  onCardChange,
  canEdit = true,
}) => {
  const [value, setValue] = useState("");
  const [isAddComment, setIsAddComment] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [localComments, setLocalComments] = useState<CommentType[]>(comments);
  const [localActivities, setLocalActivities] =
    useState<ActivityType[]>(activities);

  const userAtom = useAtomValue(user);
  const addCommentMutation = useAddComment(card._id);
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  const handleAddComment = () => {
    if (!canEdit) return;
    const commentRequest: addCommentRequest = {
      authorName: userAtom?.username,
      avatar: userAtom?.avatar,
      content: value,
    };

    const newComment: CommentType = {
      _id: Date.now().toString(),
      authorName: commentRequest?.authorName ?? "Author Name",
      avatar: commentRequest.avatar ?? "Avatar",
      content: commentRequest.content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    addCommentMutation.mutate(commentRequest, {
      onSuccess: (data) => {
        const newComments = data.data.comments ?? [];
        setLocalComments(newComments);
        setLocalActivities(data.data.activities ?? []);
        onCardChange(data.data);
      },
    });
    setIsAddComment(false);
    setValue("");
  };

  const handleUpdateComment = (commentId: string, updatedContent: string) => {
    if (!canEdit) return;
    updateCommentMutation.mutate(
      {
        cardId: card._id,
        commentId: commentId,
        request: { content: updatedContent },
      },
      {
        onSuccess: (data) => {
          const updatedComments = data.data.comments ?? [];
          setLocalComments(updatedComments);
          setLocalActivities(data.data.activities ?? []);
          onCardChange(data.data);
        },
      },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (!canEdit) return;
    deleteCommentMutation.mutate(
      { cardId: card._id, commentId: commentId },
      {
        onSuccess: (data) => {
          const updatedComments = data.data.comments ?? [];
          setLocalComments(updatedComments);
          setLocalActivities(data.data.activities ?? []);
          onCardChange(data.data);
        },
      },
    );
  };

  return (
    <Box sx={{ p: {xs: 0, sm: 2} }}>
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
            marginLeft: { xs: 0, sm: 1 },
          }}
        >
          <ChatOutlined fontSize="small" />
          <Typography variant="body2">Comments and activity</Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowDetails((prev) => !prev)}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </Box>

      {canEdit && !isAddComment && (
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            mt: 1,
          }}
          onClick={() => setIsAddComment(true)}
        >
          Write a comment...
        </Button>
      )}

      <Box mt={1}>
        {isAddComment && (
          <Box mb={1}>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
            <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
              <Button variant="contained" onClick={handleAddComment}>
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAddComment(false);
                  setValue("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {localComments?.map((comment) => (
        <CommentItem
          key={comment._id}
          authorName={comment.authorName}
          avatar={comment.avatar || ""}
          content={comment.content}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt || ""}
          onDelete={() => handleDeleteComment(comment._id)}
          onUpdate={(updatedContent) =>
            handleUpdateComment(comment._id, updatedContent)
          }
          canEdit={canEdit}
        />
      ))}

      {showDetails && (
        <Box mt={2}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Activity
          </Typography>
          {localActivities.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No activity yet
            </Typography>
          ) : (
            localActivities
              .slice()
              .reverse()
              .map((activity) => (
                <ActivityItem key={activity._id} activity={activity} />
              ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
