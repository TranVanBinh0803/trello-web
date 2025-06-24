import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  EditNote,
  AddCard,
  PermIdentity,
  AccessTime,
  Cloud,
} from "@mui/icons-material";
import { CardType } from "~/types/card";

interface CardMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEditCard: () => void;
  onOpenCard: () => void;
  onArchiveCard: (card: CardType) => void;
  card: CardType;
}

const CardMenu: React.FC<CardMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onEditCard,
  onOpenCard,
  onArchiveCard,
  card,
}) => {
  const handleEditCard = () => {
    onEditCard();
    onClose();
  };

  const handleOpenCard = () => {
    onOpenCard();
    onClose();
  };

  const handleArchiveCard = () => {
    onArchiveCard(card);
    onClose();
  };

  return (
    <Menu
      id="menu-edit-card-dropdown"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        root: {
          "aria-labelledby": "edit-card-dropdown",
        },
      }}
    >
      <MenuItem onClick={handleEditCard}>
        <ListItemIcon>
          <EditNote fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit card</ListItemText>
      </MenuItem>
      
      <MenuItem onClick={handleOpenCard}>
        <ListItemIcon>
          <AddCard fontSize="small" />
        </ListItemIcon>
        <ListItemText>Open card</ListItemText>
      </MenuItem>
      
      <MenuItem>
        <ListItemIcon>
          <PermIdentity fontSize="small" />
        </ListItemIcon>
        <ListItemText>Change members</ListItemText>
      </MenuItem>
      
      <MenuItem>
        <ListItemIcon>
          <AccessTime fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit dates</ListItemText>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleArchiveCard}>
        <ListItemIcon>
          <Cloud fontSize="small" />
        </ListItemIcon>
        <ListItemText>Archive</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default CardMenu;