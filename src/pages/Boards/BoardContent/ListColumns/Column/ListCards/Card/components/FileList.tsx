import { Box, Typography, Stack, Button } from "@mui/material";
import { Attachment } from "@mui/icons-material";
import FileItem from "./FileItem";

export interface FileItemType {
  id: string;
  fileName: string;
  fileType: string;
  fileURL: string;
  createdAt: string;
  updatedAt: string;
}

interface FileListProps {
  files: FileItemType[];
}

export const mockFileList: FileItemType[] = [
  {
    id: "1",
    fileName: "Bản cam kết - Giáo viên Cờ Partime.docx",
    fileType: "DOCX",
    fileURL: "URL",
    createdAt: "2025-05-26T15:00:00Z",
    updatedAt: "2025-05-26T15:00:00Z",
  },
  {
    id: "2",
    fileName: "index (1).html",
    fileType: "HTML",
   fileURL: "URL",
    createdAt: "2025-05-26T15:00:00Z",
    updatedAt: "2025-05-26T15:00:00Z",
  },
  {
    id: "3",
    fileName: "styles.css",
    fileType: "CSS",
    fileURL: "URL",
    createdAt: "2025-05-26T15:00:00Z",
    updatedAt: "2025-05-26T15:00:00Z",
  },
];

const FileList: React.FC<FileListProps> = ({ files }) => {
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
          {files.map((file) => (
            <FileItem
              id={file.id}
              fileName={file.fileName}
              fileType={file.fileType}
              fileURL={file.fileURL}
              createdAt={file.createdAt}
              updatedAt={file.updatedAt}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default FileList;
