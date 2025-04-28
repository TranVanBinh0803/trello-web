import { Box } from "@mui/material";
import React from "react";
import ModeSelect from "../ModeSelect";

const AppBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: (theme) => theme.trello.appBarHeight,
        width: "100%",
      }}
    >
      <ModeSelect />
    </Box>
  );
};

export default AppBar;
