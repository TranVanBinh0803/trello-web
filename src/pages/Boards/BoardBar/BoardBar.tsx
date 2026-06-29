import { useState, type FormEvent } from "react";
import {
  DashboardRounded,
  Inventory2Rounded,
  LockRounded,
  LogoutRounded,
  WorkspacePremium,
  PersonAdd,
  RestoreRounded,
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
import { useGetArchivedBoardItems } from "./api/useGetArchivedBoardItems";
import { useCreatePrivateUpgradePayment } from "./api/useCreatePrivateUpgradePayment";
import { useRestoreColumn } from "../BoardContent/ListColumns/Column/api/useRestoreColumn";
import { useRestoreCard } from "../BoardContent/ListColumns/Column/ListCards/Card/api/useRestoreCard";

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
  const [archivedOpen, setArchivedOpen] = useState(false);
  const [privateUpgradeOpen, setPrivateUpgradeOpen] = useState(false);
  const [email, setEmail] = useState("");

  const inviteBoardMemberMutation = useInviteBoardMember(board?._id || "");
  const leaveBoardMutation = useLeaveBoard(board?._id || "");
  const privateUpgradePaymentMutation = useCreatePrivateUpgradePayment();
  const restoreColumnMutation = useRestoreColumn(board?._id || "");
  const restoreCardMutation = useRestoreCard({ boardId: board?._id });
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
  const archivedItemsQuery = useGetArchivedBoardItems(
    board?._id,
    archivedOpen && isBoardReady && isCurrentUserMember
  );
  const trimmedEmail = email.trim();
  const isInviteEmailValid = SchemaUtils.validator.isValidEmail(trimmedEmail);
  const shouldShowEmailError = Boolean(trimmedEmail) && !isInviteEmailValid;
  const archivedColumns = archivedItemsQuery.data?.data.columns ?? [];
  const archivedCards = archivedItemsQuery.data?.data.cards ?? [];
  const archivedItemCount = archivedColumns.length + archivedCards.length;

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

  const handleCloseArchivedDialog = () => {
    setArchivedOpen(false);
  };

  const handleClosePrivateUpgradeDialog = () => {
    setPrivateUpgradeOpen(false);
  };

  const handleConfirmPrivateUpgrade = () => {
    if (!board?._id || !isCurrentUserOwner || !isPublic) return;
    privateUpgradePaymentMutation.mutate(board._id);
  };

  const handleRestoreColumn = (columnId: string) => {
    restoreColumnMutation.mutate(columnId, {
      onSuccess: () => {
        archivedItemsQuery.refetch();
      },
    });
  };

  const handleRestoreCard = (columnId: string, cardId: string) => {
    restoreCardMutation.mutate(
      { columnId, cardId },
      {
        onSuccess: () => {
          archivedItemsQuery.refetch();
        },
      }
    );
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
              {isPublic && isCurrentUserOwner && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<LockRounded />}
                  onClick={() => setPrivateUpgradeOpen(true)}
                >
                  Make private
                </Button>
              )}
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
          <Button
            variant="outlined"
            startIcon={<Inventory2Rounded />}
            onClick={() => setArchivedOpen(true)}
            disabled={!isBoardReady || !isCurrentUserMember}
          >
            Archived
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

      <Dialog
        open={privateUpgradeOpen}
        onClose={handleClosePrivateUpgradeDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Make board private?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Public boards are free. To switch this board to private, you will be
            redirected to VNPAY sandbox to complete a test payment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrivateUpgradeDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmPrivateUpgrade}
            disabled={privateUpgradePaymentMutation.isPending}
          >
            Continue to VNPAY
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={archivedOpen}
        onClose={handleCloseArchivedDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Archived items</DialogTitle>
        <DialogContent>
          {archivedItemsQuery.isFetching ? (
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {["archived-item-skeleton-1", "archived-item-skeleton-2"].map(
                (key) => (
                  <Skeleton variant="rounded" height={56} key={key} />
                )
              )}
            </Box>
          ) : archivedItemCount === 0 ? (
            <Box
              sx={{
                minHeight: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography color="text.secondary">No archived items.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Columns
                </Typography>
                {archivedColumns.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No archived columns.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {archivedColumns.map((column) => (
                      <ListItem
                        key={column._id}
                        disableGutters
                        secondaryAction={
                          <Button
                            size="small"
                            color="success"
                            startIcon={<RestoreRounded />}
                            onClick={() => handleRestoreColumn(column._id)}
                            disabled={restoreColumnMutation.isPending}
                          >
                            Restore
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={column.title}
                          secondary={`${column.cardOrderIds.length} cards`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Cards
                </Typography>
                {archivedCards.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No archived cards.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {archivedCards.map((card) => (
                      <ListItem
                        key={card._id}
                        disableGutters
                        secondaryAction={
                          <Button
                            size="small"
                            color="success"
                            startIcon={<RestoreRounded />}
                            onClick={() =>
                              handleRestoreCard(card.columnId, card._id)
                            }
                            disabled={restoreCardMutation.isPending}
                          >
                            Restore
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={card.title || "Untitled card"}
                          secondary="Archived card"
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseArchivedDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoardBar;
