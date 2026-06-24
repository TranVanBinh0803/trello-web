import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Column from "./Column/Column";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import { ListColumnsProps } from "~/types/column";
import { useCreateColumn } from "./api/useCreateColumn";
import { useAtomValue } from "jotai";
import { boardDataAtom } from "~/atoms/BoardAtom";

const ListColumns: React.FC<ListColumnsProps> = ({ columns, canEdit = true }) => {
  const board = useAtomValue(boardDataAtom);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

  const [newColumnTitle, setNewColumnTitle] = useState("");

  const createColumnApi = useCreateColumn();

  const addNewColumn = async () => {
    if (!board?._id) {
      toast.error("Board is not ready");
      return;
    }

    if (!newColumnTitle.trim()) {
      toast.error("Please enter column title");
      return;
    }

    const newColumnData = {
      title: newColumnTitle,
      boardId: board._id,
    };

    try {
      createColumnApi.mutate(newColumnData);
      toggleOpenNewColumnForm();
      setNewColumnTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
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
        {columns?.map((column) => (
          <Column key={column._id} column={column} canEdit={canEdit} />
        ))}

        {canEdit && !openNewColumnForm ? (
          <Box
            sx={{
              minWidth: 250,
              maxWidth: 250,
              mx: 2,
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "rgba(0 , 0, 0, 0.04)",
              height: "fit-content",
            }}
            onClick={toggleOpenNewColumnForm}
          >
            <Button
              sx={{ width: "100%", justifyContent: "center", py: 1 }}
              startIcon={<NoteAddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : canEdit ? (
          <Box
            sx={{
              minWidth: 250,
              maxWidth: 250,
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Enter column label ..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{ boxShadow: "none", border: "none" }}
              >
                Add Column
              </Button>
              <Close
                fontSize="small"
                sx={{ cursor: "pointer", "&:hover": { color: "#ccc" } }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
