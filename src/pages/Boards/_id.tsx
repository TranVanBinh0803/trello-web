import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import AppBar from "~/components/AppBar/AppBar";

const Board: React.FC = () => {
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    const boardId = "682aec06ccbbf399b8a14ea5";
    fetchBoardDetailsAPI(boardId).then((boardData: any) => {
      setBoard(boardData);
    });
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
};

export default Board;
