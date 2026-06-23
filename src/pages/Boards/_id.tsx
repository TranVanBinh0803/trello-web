import { Box, Container, Typography } from "@mui/material";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import AppBar from "~/components/AppBar/AppBar";
import { useBoardData } from "~/hooks/board/useBoardData";
import { useParams } from "react-router-dom";

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { isFetching } = useBoardData(boardId);

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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar />
      <BoardContent isFetching={isFetching} />
    </Container>
  );
};

export default Board;
