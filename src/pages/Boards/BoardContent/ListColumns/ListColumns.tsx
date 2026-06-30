import { Box, Button, TextField, Tooltip } from "@mui/material";
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
  const trimmedNewColumnTitle = newColumnTitle.trim();
  const isNewColumnTitleValid = trimmedNewColumnTitle.length >= 3;

  const createColumnApi = useCreateColumn();

  const addNewColumn = async () => {
    if (!board?._id) {
      toast.error("Board is not ready");
      return;
    }

    if (!isNewColumnTitleValid) {
      toast.error("Column title must be at least 3 characters");
      return;
    }

    const newColumnData = {
      title: trimmedNewColumnTitle,
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
          gap: { xs: 1, sm: 0 },
          scrollSnapType: { xs: "x proximity", sm: "none" },
          WebkitOverflowScrolling: "touch",
          pb: 1,
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
              mx: { xs: 0, sm: 2 },
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
              mx: { xs: 0, sm: 2 },
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Tooltip
              title={
                Boolean(trimmedNewColumnTitle) && !isNewColumnTitleValid
                  ? "At least 3 characters"
                  : ""
              }
            >
              <TextField
                label="Enter column label ..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                error={Boolean(trimmedNewColumnTitle) && !isNewColumnTitleValid}
              />
            </Tooltip>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                disabled={!isNewColumnTitleValid || createColumnApi.isPending}
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
