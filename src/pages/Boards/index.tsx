import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppBar from "~/components/AppBar/AppBar";
import { useGetMyBoards } from "./api/useGetMyBoards";

export default function BoardsPage() {
  const navigate = useNavigate();
  const { data, isFetching } = useGetMyBoards();
  const boards = data?.data ?? [];

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
                <Card sx={{ height: 150 }}>
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
    </Container>
  );
}
