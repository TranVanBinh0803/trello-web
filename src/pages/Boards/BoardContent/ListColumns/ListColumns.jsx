import { Box, Button } from "@mui/material";
import React from "react";
import Column from "./Column/Column";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const ListColumns = ({ columns }) => {
  return (
    <Box
      sx={{
        bgcolor: "inherit",
        width: "100%",
        height: "100%",
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {columns?.map((column) => {
        return <Column key={column._id} column={column} />;
      })}

      <Box
        sx={{
          minWidth: 180,
          maxWidth: 180,
          mx: 2,
          borderRadius: "8px",
          border: "1px solid #ccc",
          backgroundColor: "rgba(0 , 0, 0, 0.04)",
          height: "fit-content",
        }}
      >
        <Button
          sx={{ width: "100%", justifyContent: "center", py: 1 }}
          startIcon={<NoteAddIcon />}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  );
};

export default ListColumns;
