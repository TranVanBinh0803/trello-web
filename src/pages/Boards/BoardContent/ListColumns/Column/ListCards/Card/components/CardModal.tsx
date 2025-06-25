import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Tooltip,
  Checkbox,
} from "@mui/material";
import { CardType } from "~/types/card";
import {
  Add,
  Attachment,
  Notes,
  PersonAdd,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Schedule,
  TaskAlt,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import FileList, { mockFileList } from "./FileList";
import CommentList, { mockCommentList } from "./CommentList";
interface CardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
}

const CardModal: React.FC<CardModalProps> = ({ open, onClose, card }) => {
  const [value, setValue] = useState("<p>Hello <strong>world</strong></p>");
  const [isOpenDescription, setIsOpenDescription] = useState(false);

  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
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
        <Typography
          id="card-modal-title"
          variant="h6"
          sx={{ borderBottom: "1px solid #ccc", paddingBottom: 1 }}
        >
          {card.title}
        </Typography>
        <Typography id="card-modal-description" sx={{ mt: 2 }} component="div">
          <Grid container spacing={2}>
            <Grid size={7}>
              <Box
                sx={{
                  maxHeight: "65vh",
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Mark complete">
                    <Checkbox
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<RadioButtonChecked />}
                    />
                  </Tooltip>
                  <Typography variant="body2">{card.title}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Button variant="outlined" startIcon={<Add />}>
                    Add
                  </Button>
                  <Button variant="outlined" startIcon={<Schedule />}>
                    Labels
                  </Button>
                  <Button variant="outlined" startIcon={<TaskAlt />}>
                    Dates
                  </Button>
                  <Button variant="outlined" startIcon={<PersonAdd />}>
                    Checklist
                  </Button>
                  <Button variant="outlined" startIcon={<Attachment />}>
                    Members
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      marginLeft: 1,
                    }}
                  >
                    <Notes fontSize="small" />
                    <Typography variant="body2">Description</Typography>
                  </Box>
                  {!isOpenDescription && (
                    <Button
                      variant="outlined"
                      onClick={() => setIsOpenDescription(true)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Box mt={1}>
                  {!isOpenDescription ? (
                    <Box ml={1}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: card.description || "",
                        }}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                      />
                      <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
                        <Button variant="contained">Save</Button>
                        <Button
                          variant="outlined"
                          onClick={() => setIsOpenDescription(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
                {!isOpenDescription && (
                  <Button
                    variant="outlined"
                    sx={{ justifyContent: "flex-start", width: "100%", mt: 1 }}
                    onClick={() => setIsOpenDescription(true)}
                  >
                    Add a more detailed description...
                  </Button>
                )}
                <FileList files={mockFileList}/>
              </Box>
            </Grid>
            <Grid size={5}>
              <Box
                sx={{
                  maxHeight: "65vh",
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                <CommentList comments={mockCommentList}/>
              </Box>
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </Modal>
  );
};

export default CardModal;
