import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { CardType } from "~/types/card";

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
}

const CardModal: React.FC<CardModalProps> = ({ open, onClose, card }) => {
  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    padding: "24px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="card-modal-title"
      aria-describedby="card-modal-description"
      BackdropProps={{
        style: {
          userSelect: "none", 
        },
      }}
    >
      <Box sx={modalStyles}>
        <Typography id="card-modal-title" variant="h6" component="h2">
          {card.title}
        </Typography>
        <Typography id="card-modal-description" sx={{ mt: 2 }}>
          Chi tiết card: {card.title}
        </Typography>
        <Box sx={{ mt: 3 }}>
          {card.description && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {card.description}
            </Typography>
          )}

          {card.memberIds && card.memberIds.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Members: {card.memberIds.length}
              </Typography>
            </Box>
          )}

          {card.comments && card.comments.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Comments: {card.comments.length}
              </Typography>
            </Box>
          )}

          {card.attachments && card.attachments.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Attachments: {card.attachments.length}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CardModal;
