import { Box } from "@mui/material";
import React from "react";

const BoardContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight}) `,
      }}
    >
      BoardContent
    </Box>
  );
};

export default BoardContent;
