import { Container } from "@mui/material";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import AppBar from "~/components/AppBar/AppBar";
import { useBoardData } from "~/hooks/board/useBoardData";

const Board: React.FC = () => {
  const boardId = "682aec06ccbbf399b8a14ea5";
  const { isFetching } = useBoardData(boardId);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar />
      <BoardContent isFetching={isFetching} />
    </Container>
  );
};

export default Board;
