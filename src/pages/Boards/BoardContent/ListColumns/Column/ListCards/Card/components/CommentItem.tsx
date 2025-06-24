import React from 'react';
import { Avatar, Box, Typography, Button, Stack } from '@mui/material';
import { format } from 'date-fns';

interface CommentItemProps {
  authorName: string;
  content: string;
  createdAt: string;
  isEdited?: boolean;
  isComment?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
};

const CommentItem: React.FC<CommentItemProps> = ({
  authorName,
  content,
  createdAt,
  isEdited = false,
  isComment = true,
  onEdit,
  onDelete,
}) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
      <Avatar sx={{ bgcolor: '#f4a261', fontSize: 'small' }}>
        {getInitials(authorName)}
      </Avatar>
      <Box flex={1}>
        <Typography variant="subtitle2" fontWeight={600}>
          {authorName}{' '}
          <Typography variant="caption" color="text.secondary" component="span">
            {format(new Date(createdAt), 'MMM dd, yyyy, h:mm a')}
            {isEdited && ' (edited)'}
          </Typography>
        </Typography>

        {isComment ? (
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 1,
              padding: 1,
              mt: 0.5,
              backgroundColor: '#fafafa',
            }}
          >
            <Typography variant="body2">{content}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {content}
          </Typography>
        )}

        {isComment && (
          <Stack direction="row" spacing={2} mt={0.5}>
            <Button onClick={onEdit} size="small">Edit</Button>
            <Button onClick={onDelete} size="small">Delete</Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
