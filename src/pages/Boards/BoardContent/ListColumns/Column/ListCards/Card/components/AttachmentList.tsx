import { Box, Typography, Stack, Button } from "@mui/material";
import { Attachment } from "@mui/icons-material";
import { AttachmentType, CardType } from "~/types/card";
import AttachmentItem from "./AttachmentItem";
import { useUpdateAttachment } from "../api/useUpdateAttachment";
import { useDeleteAttachment } from "../api/useDeleteAttachment";
import { useState } from "react";

interface AttachmentListProps {
  card: CardType;
  attachments: AttachmentType[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  card,
  attachments,
}) => {
  const updateAttachmentMutation = useUpdateAttachment();
  const deleteAttachmentMutation = useDeleteAttachment();
  const [localAttachments, setLocalAttachments] = useState(attachments);

  const handleUpdateAttachment = (
    attachmentId: string,
    updatedFileName: string
  ) => {
    updateAttachmentMutation.mutate({
      cardId: card._id,
      attachmentId: attachmentId,
      request: { fileName: updatedFileName },
    });
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachmentMutation.mutate({
      cardId: card._id,
      attachmentId: attachmentId,
    }),
      {
        onSuccess: () => {
          console.log("Here");
          setLocalAttachments((prev) =>
            prev.filter((item) => item._id !== attachmentId)
          );
          console.log("localAttachments:", localAttachments);
        },
      };
  };

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
            gap: 2,
            marginLeft: 1,
          }}
        >
          <Attachment fontSize="small" />
          <Typography variant="body2">Attachments</Typography>
        </Box>

        <Button variant="outlined">Add</Button>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, ml: 1 }}>
          Files ({localAttachments.length})
        </Typography>

        {localAttachments.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No attachments yet
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {localAttachments.map((attachment) => (
              <AttachmentItem
                key={attachment._id}
                _id={attachment._id}
                fileName={attachment.fileName}
                fileUrl={attachment.fileUrl}
                createdAt={attachment.createdAt}
                updatedAt={attachment.updatedAt}
                onUpdate={(updatedFileName) =>
                  handleUpdateAttachment(attachment._id, updatedFileName)
                }
                onDelete={() => handleDeleteAttachment(attachment._id)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default AttachmentList;
