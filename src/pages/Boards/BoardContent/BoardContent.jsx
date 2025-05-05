import React from "react";
import { Box } from "@mui/material";

import ListColumns from "./ListColumns/ListColumns";

const BoardContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        height: (theme) => theme.trello.boardContentHeight,
        width: "100%",
        p: "10px 0",
      }}
    >
      <ListColumns />
    </Box>
  );
};

export default BoardContent;
