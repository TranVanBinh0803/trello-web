import React, { useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Box,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import {
  AddCard,
  Close,
  Cloud,
  ContentCut,
  DeleteForever,
  DragHandle,
} from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListCards from "./ListCards/ListCards";
import { mapOrder } from "~/untils/sorts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { ColumnProps, ColumnType } from "~/types/column";
import { useCreateCard } from "~/pages/Boards/api/useCreateCard";
import { useArchiveColumn } from "~/pages/Boards/api/useArchiveColumn";

const Column: React.FC<ColumnProps> = ({ column }) => {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const orderedCards = mapOrder(column.cards, column.cardOrderIds, "_id");

  const [openNewCardForm, setOpenNewCardForm] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>("");

  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm((prev) => !prev);
  };

  const createCardApi = useCreateCard();

  const addNewCard = () => {
    if (!newCardTitle.trim()) {
      toast.error("Please enter card title");
      return;
    }

    const newCardData = {
      title: newCardTitle,
      boardId: "682aec06ccbbf399b8a14ea5",
      columnId: column._id,
    };

    try {
      createCardApi.mutate(newCardData);
      toggleOpenNewCardForm();
      setNewCardTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const archiveColumnMutation = useArchiveColumn(column.boardId);

  const handleArchiveColumn = (column: ColumnType) => {
    archiveColumnMutation.mutate({ columnId: column._id });
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: 300,
          maxWidth: 300,
          ml: 2,
          borderRadius: "8px",
          border: "1px solid #ccc",
          backgroundColor: "rgba(0 , 0, 0, 0.04)",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem !important",
            }}
          >
            {column.title}
          </Typography>

          <Box>
            <Tooltip title="More options">
              <Box
                sx={{
                  padding: "3px",
                  borderRadius: "8px",
                  height: "32px",
                  width: "32px",
                  "&:hover": { backgroundColor: "#d0d4db" },
                }}
              >
                <MoreHorizIcon
                  sx={{ color: "text.primary", cursor: "pointer" }}
                  id="basic-column-dropdown"
                  aria-controls={
                    open ? "basic-menu-column-dropdown" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                />
              </Box>
            </Tooltip>

            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                root: {
                  "aria-labelledby": "basic-column-dropdown",
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCard fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Box>Add new card</Box>
                </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Box>Cut</Box>
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText onClick={() => handleArchiveColumn(column)}>
                  <Box>Archive this column</Box>
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List cards */}
        <ListCards cards={orderedCards} />

        {/* Footer */}
        <Box sx={{ height: (theme) => theme.trello.columnFooterHeight, p: 2 }}>
          {!openNewCardForm ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button startIcon={<AddCard />} onClick={toggleOpenNewCardForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandle sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title ..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="medium"
                  sx={{
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  Add
                </Button>
                <Close
                  fontSize="small"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ccc" } }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Column;
