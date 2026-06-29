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
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import { useAtomValue } from "jotai";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { user } from "~/atoms/AuthAtoms";
import AppBar from "~/components/AppBar/AppBar";
import { BoardType } from "~/types/board";
import { useGetMyBoards } from "./api/useGetMyBoards";
import { useArchiveBoard } from "./api/useArchiveBoard";
import { useGetArchivedBoards } from "./api/useGetArchivedBoards";
import { useRestoreBoard } from "./api/useRestoreBoard";

export default function BoardsPage() {
  const navigate = useNavigate();
  const { data, isFetching } = useGetMyBoards();
  const archivedBoardsQuery = useGetArchivedBoards();
  const currentUser = useAtomValue(user);
  const archiveBoardMutation = useArchiveBoard();
  const restoreBoardMutation = useRestoreBoard();
  const [archiveTargetBoard, setArchiveTargetBoard] = useState<BoardType | null>(
    null
  );
  const boards = data?.data ?? [];
  const archivedBoards = archivedBoardsQuery.data?.data ?? [];
  const isOwner = (board: BoardType) =>
    board.ownerIds?.some((ownerId) => ownerId.toString() === currentUser?._id);

  const handleOpenArchiveDialog = (
    event: MouseEvent<HTMLButtonElement>,
    board: BoardType
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setArchiveTargetBoard(board);
  };

  const handleCloseArchiveDialog = () => {
    setArchiveTargetBoard(null);
  };

  const handleConfirmArchiveBoard = () => {
    if (!archiveTargetBoard) return;
    archiveBoardMutation.mutate(archiveTargetBoard._id, {
      onSuccess: () => {
        setArchiveTargetBoard(null);
      },
    });
  };

  const handleRestoreBoard = (
    event: MouseEvent<HTMLButtonElement>,
    board: BoardType
  ) => {
    event.preventDefault();
    event.stopPropagation();
    restoreBoardMutation.mutate(board._id);
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
                    <Tooltip title="Archive board">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(event) => handleOpenArchiveDialog(event, board)}
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
                        <ArchiveRoundedIcon fontSize="small" />
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

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Archived boards
          </Typography>
          {archivedBoardsQuery.isFetching ? (
            <Grid container spacing={2}>
              {["archived-board-skeleton-1", "archived-board-skeleton-2"].map(
                (key) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                    <Skeleton variant="rounded" height={120} />
                  </Grid>
                )
              )}
            </Grid>
          ) : archivedBoards.length === 0 ? (
            <Typography color="text.secondary">
              No archived boards.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {archivedBoards.map((board) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board._id}>
                  <Card sx={{ height: 132, position: "relative", opacity: 0.86 }}>
                    {isOwner(board) && (
                      <Tooltip title="Restore board">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={(event) => handleRestoreBoard(event, board)}
                          disabled={restoreBoardMutation.isPending}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            bgcolor: "success.main",
                            color: "success.contrastText",
                            "&:hover": {
                              bgcolor: "success.dark",
                            },
                          }}
                        >
                          <RestoreRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        pr: 7,
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
                      <Chip size="small" label="Archived" color="warning" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Dialog
        open={Boolean(archiveTargetBoard)}
        onClose={handleCloseArchiveDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Archive board?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will move "{archiveTargetBoard?.title}" to archived boards. You
            can restore it later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseArchiveDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmArchiveBoard}
            disabled={archiveBoardMutation.isPending}
          >
            Archive board
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
