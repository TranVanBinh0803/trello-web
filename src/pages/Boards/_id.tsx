import { Box, Container, Typography } from "@mui/material";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import AppBar from "~/components/AppBar/AppBar";
import { useBoardData } from "~/hooks/board/useBoardData";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { error, isError, isFetching } = useBoardData(boardId);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (!paymentStatus) return;

    if (paymentStatus === "success") {
      toast.success("Payment successful. This board is now private.");
    }
    if (paymentStatus === "failed") {
      toast.error("Payment was not completed.");
    }
    if (paymentStatus === "invalid") {
      toast.error("Payment verification failed.");
    }

    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  if (!boardId) {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
        <AppBar />
        <Box
          sx={{
            height: (theme) =>
              `calc(100vh - ${theme.trello.appBarHeight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">
            Select a board or import one from the Create menu.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
        <AppBar />
        <Box
          sx={{
            height: (theme) =>
              `calc(100vh - ${theme.trello.appBarHeight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            {error?.message || "You cannot access this board."}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar />
      <BoardContent isFetching={isFetching} />
    </Container>
  );
};

export default Board;
