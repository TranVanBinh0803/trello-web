import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useAtomValue } from "jotai";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { user } from "~/atoms/AuthAtoms";
import AppBar from "~/components/AppBar/AppBar";
import { BoardType } from "~/types/board";
import { useGetMyBoards } from "./api/useGetMyBoards";
import { useDeleteBoard } from "./api/useDeleteBoard";

export default function BoardsPage() {
  const navigate = useNavigate();
  const { data, isFetching } = useGetMyBoards();
  const currentUser = useAtomValue(user);
  const deleteBoardMutation = useDeleteBoard();
  const [deleteTargetBoard, setDeleteTargetBoard] = useState<BoardType | null>(
    null
  );
  const boards = data?.data ?? [];
  const isOwner = (board: BoardType) =>
    board.ownerIds?.some((ownerId) => ownerId.toString() === currentUser?._id);

  const handleOpenDeleteDialog = (
    event: MouseEvent<HTMLButtonElement>,
    board: BoardType
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteTargetBoard(board);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteTargetBoard(null);
  };

  const handleConfirmDeleteBoard = () => {
    if (!deleteTargetBoard) return;
    deleteBoardMutation.mutate(deleteTargetBoard._id, {
      onSuccess: () => {
        setDeleteTargetBoard(null);
      },
    });
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ minHeight: "100vh" }}>
      <AppBar />
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Your boards
        </Typography>

        {isFetching ? (
          <Grid container spacing={2}>
            {["board-skeleton-1", "board-skeleton-2", "board-skeleton-3"].map(
              (key) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                  <Skeleton variant="rounded" height={140} />
                </Grid>
              )
            )}
          </Grid>
        ) : boards.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              No boards yet. Import one from the Create menu.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {boards.map((board) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board._id}>
                <Card sx={{ height: 150, position: "relative" }}>
                  {isOwner(board) && (
                    <Tooltip title="Delete board">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(event) => handleOpenDeleteDialog(event, board)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          bgcolor: "error.main",
                          color: "error.contrastText",
                          "&:hover": {
                            bgcolor: "error.dark",
                          },
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <CardActionArea
                    sx={{ height: "100%", alignItems: "stretch" }}
                    onClick={() => navigate(`/boards/${board._id}`)}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={700}>{board.title}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {board.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip size="small" label={board.type} />
                        <Chip
                          size="small"
                          label={`${board.columnOrderIds.length} columns`}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog
        open={Boolean(deleteTargetBoard)}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete board?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will remove "{deleteTargetBoard?.title}" from your boards.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteBoard}
            disabled={deleteBoardMutation.isPending}
          >
            Delete board
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
