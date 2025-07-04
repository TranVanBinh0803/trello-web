import { Box, Typography, IconButton, Stack, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HelperUtils } from '~/untils/helpers';
import { AttachmentType } from '~/types/card';
import { format } from 'date-fns';


const AttachmentItem = ({ fileName, fileUrl, createdAt, updatedAt }: AttachmentType) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#f4f5f7',
        },
        px: 1,
        py: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            backgroundColor: '#e7e9ec',
            color: '#172b4d',
            borderRadius: 1,
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
          }}
        >
          {HelperUtils.getFileType(fileName).toLocaleUpperCase()}
        </Box>
        <Box>
          <Typography fontWeight={500}>{fileName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(createdAt), "MMM dd, yyyy, h:mm a")}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1}>
        <IconButton>
          <OpenInNewIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default AttachmentItem;
