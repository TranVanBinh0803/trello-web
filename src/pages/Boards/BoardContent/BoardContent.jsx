import React from "react";
import { Box } from "@mui/material";
import { mapOrder } from "~/untils/sorts";
import ListColumns from "./ListColumns/ListColumns";

const BoardContent = ({ board }) => {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, "_id");
  return (
    <Box
      sx={{
        flex: 1,
        height: (theme) => theme.trello.boardContentHeight,
        width: "100%",
        p: "10px 0",
      }}
    >
      <ListColumns columns={orderedColumns} />
    </Box>
  );
};

export default BoardContent;
