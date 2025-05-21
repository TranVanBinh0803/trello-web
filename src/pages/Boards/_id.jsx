import { Container } from "@mui/material";
import * as React from "react";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useState, useEffect } from "react";
import { fetchBoardDetailsAPI } from "~/apis";

const Board = () => {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    const boardId = "682aec06ccbbf399b8a14ea5";
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
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
