import React from "react";
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
} from "@mui/material";
import {
  AddCard,
  Cloud,
  ContentCut,
  DeleteForever,
  DragHandle,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListCards from "./ListCards/ListCards";
import { mapOrder } from "~/untils/sorts";

const Column = ({ column }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, "_id");

  return (
    <Box
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
      {/* Box Column Header */}
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
            <ExpandMoreIcon
              sx={{ color: "text.primary", cursor: "pointer" }}
              id="basic-column-dropdown"
              aria-controls={open ? "basic-menu-column-dropdown" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="basic-menu-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              "aria-labelledby": "basic-column-dropdown",
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCard fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <DeleteForever fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* List Card */}
      <ListCards cards={orderedCards} />

      {/* Box Column Footer */}
      <Box
        sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button startIcon={<AddCard />}>Add new card</Button>
        <Tooltip title="Drag to move">
          <DragHandle sx={{ cursor: "pointer" }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Column;
