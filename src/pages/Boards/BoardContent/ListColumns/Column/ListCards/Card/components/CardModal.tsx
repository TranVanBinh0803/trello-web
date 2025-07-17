import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Tooltip,
  Checkbox,
  IconButton,
} from "@mui/material";
import { CardType } from "~/types/card";
import {
  Add,
  Attachment,
  CloseRounded,
  ImageOutlined,
  KeyboardArrowDownRounded,
  MoreHorizOutlined,
  Notes,
  PersonAdd,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Schedule,
  TaskAlt,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import CommentList from "./CommentList";
import { useUpdateCard } from "../api/useUpdateCard";
import { HelperUtils } from "~/untils/helpers";
import AttachmentList from "./AttachmentList";
import CoverMenu from "./CoverMenu";

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
}

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: 0,
};

const CardModal: React.FC<CardModalProps> = ({ open, onClose, card }) => {
  const [value, setValue] = useState("");
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [localCard, setLocalCard] = useState<CardType>(card);
  const updateCardMutation = useUpdateCard(card._id);

  const handleOpenCoverMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCoverMenu = () => {
    setAnchorEl(null);
  };

  const handleAddDescription = () => {
    updateCardMutation.mutate({
      description: value,
    });
    setLocalCard((prev) => ({
      ...prev,
      description: value,
    }));
    setIsOpenDescription(false);
  };

  const handleSetCover = (fileUrl: string) => {
    updateCardMutation.mutate({
      cover: fileUrl,
    });
    setLocalCard((prev) => ({
      ...prev,
      cover: fileUrl,
    }));
  };

  const handleSetColorCover = (color: string) => {
    const newCover = localCard.cover === color ? "" : color;
    updateCardMutation.mutate({
      cover: newCover,
    });
    setLocalCard((prev) => ({
      ...prev,
      cover: newCover,
    }));
  };

  const handleSetLocalCard = (card: CardType) => {
    setLocalCard(card);
  };

  // Check if cover is a color (starts with #) or an image URL
  const isCoverColor = localCard.cover?.startsWith("#");
  const hasCover = Boolean(localCard.cover && localCard.cover !== "");

  const getHeaderHeight = () => {
    if (!hasCover) return "58px";
    return isCoverColor ? "116px" : "160px";
  };

  const headerIconButtonStyle = {
    height: "30px",
    ...(hasCover && {
      backgroundColor: "rgba(37, 31, 31, 0.3)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    }),
  };

  useEffect(() => {
    setLocalCard(card);
  }, [card]);

  return (
    <>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingTop: 2,
              paddingX: 2,
              borderBottom: "1px solid #ccc",
              height: getHeaderHeight(),
              ...(hasCover && {
                background: isCoverColor
                  ? localCard.cover
                  : `url(${localCard.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }),
            }}
          >
            <Button
              size="small"
              variant="contained"
              endIcon={<KeyboardArrowDownRounded />}
            >
              {localCard.title}
            </Button>
            <Box display={"flex"} gap={0.5}>
              <Tooltip title={"Cover"}>
                <IconButton
                  size="small"
                  onClick={handleOpenCoverMenu}
                  sx={headerIconButtonStyle}
                >
                  <ImageOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Actions"}>
                <IconButton
                  size="small"
                  // onClick={handleOpenCoverMenu}
                  sx={headerIconButtonStyle}
                >
                  <MoreHorizOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Close"}>
                <IconButton
                  size="small"
                  onClick={onClose}
                  sx={headerIconButtonStyle}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography
            id="card-modal-description"
            sx={{ my: 2 }}
            component="div"
          >
            <Grid container spacing={2}>
              <Grid size={7} px={2}>
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
                    <Typography variant="body2">{localCard.title}</Typography>
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
                    {!HelperUtils.isEmpty(localCard.description) && (
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
                        <Box
                          dangerouslySetInnerHTML={{
                            __html: localCard.description || "",
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
                          <Button
                            variant="contained"
                            onClick={handleAddDescription}
                          >
                            Save
                          </Button>
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
                  {HelperUtils.isEmpty(localCard.description) && (
                    <Button
                      variant="outlined"
                      sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        mt: 1,
                      }}
                      onClick={() => setIsOpenDescription(true)}
                    >
                      Add a more detailed description...
                    </Button>
                  )}
                  {!HelperUtils.isEmpty(localCard.attachments) && (
                    <AttachmentList
                      card={localCard}
                      attachments={localCard?.attachments ?? []}
                    />
                  )}
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
                  <CommentList
                    card={localCard}
                    comments={localCard?.comments ?? []}
                  />
                </Box>
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Modal>
      <CoverMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseCoverMenu}
        onSetCover={handleSetCover}
        onSetColorCover={handleSetColorCover}
        onSetLocalCard={handleSetLocalCard}
        card={localCard}
      />
    </>
  );
};

export default CardModal;
