import { Box, Typography, Stack, Button } from "@mui/material";
import { Attachment } from "@mui/icons-material";
import FileItem from "./AttachmentItem";
import { AttachmentType, CardType } from "~/types/card";

interface AttachmentListProps {
  card: CardType;
  attachments: AttachmentType[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ card, attachments }) => {
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
          Files
        </Typography>
        <Stack spacing={1}>
          {attachments.map((file) => (
            <FileItem
              _id={file._id}
              fileName={file.fileName}
              fileUrl={file.fileUrl}
              createdAt={file.createdAt}
              updatedAt={file.updatedAt}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default AttachmentList;
