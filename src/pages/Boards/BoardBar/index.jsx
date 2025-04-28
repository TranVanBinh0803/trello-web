import { Box } from "@mui/material";
import React from "react";

const BoardBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      BoardBar
    </Box>
  );
};

export default BoardBar;
