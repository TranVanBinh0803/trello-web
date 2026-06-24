import { useState, type FormEvent } from "react";
import {
  AddToDriveOutlined,
  DashboardRounded,
  LogoutRounded,
  WorkspacePremium,
  PersonAdd,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { user } from "~/atoms/AuthAtoms";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { HelperUtils } from "~/untils/helpers";
import { SchemaUtils } from "~/untils/schema";
import { useInviteBoardMember } from "./api/useInviteBoardMember";
import { useLeaveBoard } from "./api/useLeaveBoard";

const MENU_STYLES = {
  color: "primary.main",
  backgroundColor: "white",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  "&:hover": {
    bgcolor: "primary.50",
  },
};

const BoardBar = () => {
  const board = useAtomValue(boardDataAtom);
  const currentUser = useAtomValue(user);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [email, setEmail] = useState("");

  const inviteBoardMemberMutation = useInviteBoardMember(board?._id || "");
  const leaveBoardMutation = useLeaveBoard(board?._id || "");
  const isPublic = board?.type === "public";
  const members = board?.members ?? [];
  const isBoardReady = Boolean(board);
  const ownerIds = board?.ownerIds ?? [];
  const memberIds = board?.memberIds ?? [];
  const isCurrentUserOwner = ownerIds.some(
    (ownerId) => ownerId.toString() === currentUser?._id
  );
  const isCurrentUserMember = memberIds.some(
    (memberId) => memberId.toString() === currentUser?._id
  );
  const trimmedEmail = email.trim();
  const isInviteEmailValid = SchemaUtils.validator.isValidEmail(trimmedEmail);
  const shouldShowEmailError = Boolean(trimmedEmail) && !isInviteEmailValid;

  const isOwner = (memberId: string) =>
    ownerIds.some((ownerId) => ownerId.toString() === memberId);

  const handleCloseInviteDialog = () => {
    setInviteOpen(false);
    setEmail("");
  };

  const handleInviteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!board?._id || !isCurrentUserOwner || !isInviteEmailValid) return;

    inviteBoardMemberMutation.mutate(
      { email: trimmedEmail },
      {
        onSuccess: () => {
          setEmail("");
        },
      }
    );
  };

  const handleCloseLeaveDialog = () => {
    setLeaveOpen(false);
  };

  const handleConfirmLeaveBoard = () => {
    if (!board?._id || isCurrentUserOwner) return;
    leaveBoardMutation.mutate(undefined, {
      onSuccess: () => {
        setLeaveOpen(false);
      },
    });
  };

  return (
    <>
      <Box
        px={2}
        sx={{
          width: "100%",
          height: (theme) => theme.trello.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isBoardReady ? (
            <>
              <Chip
                icon={<DashboardRounded color="primary" />}
                label={board?.title}
                sx={{ ...MENU_STYLES, minWidth: 160 }}
              />
              <Chip
                icon={
                  isPublic ? (
                    <PublicIcon color="primary" />
                  ) : (
                    <PublicOffIcon color="primary" />
                  )
                }
                label={`${isPublic ? "Public" : "Private"} Workspace`}
                sx={{ ...MENU_STYLES, minWidth: 170 }}
              />
              {!isCurrentUserMember && (
                <Chip
                  label="Read only"
                  color="info"
                  variant="outlined"
                  sx={{ minWidth: 96 }}
                />
              )}
            </>
          ) : (
            <>
              <Skeleton variant="rounded" width={160} height={32} />
              <Skeleton variant="rounded" width={170} height={32} />
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={() => setInviteOpen(true)}
            disabled={!isBoardReady || !isCurrentUserOwner}
          >
            Invite
          </Button>
          <Tooltip
            title={
              isCurrentUserOwner
                ? "Owners cannot leave their own board"
                : !isCurrentUserMember
                  ? "Only board members can leave"
                : "Leave this board"
            }
          >
            <Box component="span">
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutRounded />}
                onClick={() => setLeaveOpen(true)}
                disabled={
                  !isBoardReady || isCurrentUserOwner || !isCurrentUserMember
                }
              >
                Leave
              </Button>
            </Box>
          </Tooltip>
          <Box sx={{ width: 144, display: "flex", justifyContent: "flex-end" }}>
            {isBoardReady ? (
              <AvatarGroup
                max={4}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 34,
                    height: 34,
                    fontSize: 16,
                    backgroundColor: "primary.main",
                  },
                }}
              >
                {members.map((member) => (
                  <Tooltip
                    title={`${member.email}${isOwner(member._id) ? " • Owner" : ""}`}
                    key={member._id}
                  >
                    <Avatar
                      alt={member.username}
                      src={member.avatar || undefined}
                    >
                      {HelperUtils.getInitials(member.username)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            ) : (
              <AvatarGroup
                max={4}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 34,
                    height: 34,
                  },
                }}
              >
                {["member-skeleton-1", "member-skeleton-2", "member-skeleton-3"].map(
                  (key) => (
                    <Skeleton
                      animation="wave"
                      key={key}
                      variant="circular"
                      width={34}
                      height={34}
                    />
                  )
                )}
              </AvatarGroup>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={inviteOpen}
        onClose={handleCloseInviteDialog}
        fullWidth
        maxWidth="xs"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <DialogTitle>Board members</DialogTitle>
          <IconButton onClick={handleCloseInviteDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box component="form" onSubmit={handleInviteSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="User email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={inviteBoardMemberMutation.isPending}
              error={shouldShowEmailError}
              helperText={
                shouldShowEmailError ? SchemaUtils.message.invalidEmail : " "
              }
            />
            <List dense sx={{ mt: 2 }}>
              {members.map((member) => (
                <ListItem disableGutters key={member._id}>
                  <ListItemAvatar>
                    <Avatar alt={member.username} src={member.avatar || undefined}>
                      {HelperUtils.getInitials(member.username)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {member.username}
                        {isOwner(member._id) && (
                          <Chip
                            size="small"
                            icon={<WorkspacePremium />}
                            label="Owner"
                            color="success"
                            variant="outlined"
                            sx={{ height: 22 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={member.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInviteDialog}>Close</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                !isCurrentUserOwner ||
                !isInviteEmailValid ||
                inviteBoardMemberMutation.isPending
              }
            >
              Send invite
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={leaveOpen}
        onClose={handleCloseLeaveDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Leave board?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            You will lose access to this board until an owner invites you again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaveDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmLeaveBoard}
            disabled={leaveBoardMutation.isPending}
          >
            Leave board
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoardBar;
