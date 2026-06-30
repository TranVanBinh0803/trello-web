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
  Badge,
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
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { useAtomValue } from "jotai";
import { user } from "~/atoms/AuthAtoms";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { onlineUserIdsAtom } from "~/atoms/PresenceAtom";
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
  const onlineUserIds = useAtomValue(onlineUserIdsAtom);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const [privateUpgradeOpen, setPrivateUpgradeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const isMobileOrTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

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
  const isOnline = (memberId: string) => onlineUserIds.includes(memberId);

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
        px={{ xs: 1, sm: 2 }}
        sx={{
          width: "100%",
          height: (theme) => theme.trello.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 0.75, sm: 1, md: 2 },
          overflowX: "hidden",
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1, md: 2 },
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {isBoardReady ? (
            <>
              <Chip
                icon={<DashboardRounded color="primary" />}
                label={board?.title}
                sx={{
                  ...MENU_STYLES,
                  minWidth: 0,
                  maxWidth: { xs: "100%", sm: "100%", md: 260 },
                  flex: { xs: "1 1 auto", sm: "1 1 auto", md: "0 1 260px" },
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                  },
                }}
              />
              <Chip
                icon={
                  isPublic ? (
                    <PublicIcon color="primary" />
                  ) : (
                    <PublicOffIcon color="primary" />
                  )
                }
                label={isMobileOrTablet ? "" : `${isPublic ? "Public" : "Private"} Workspace`}
                sx={{
                  ...MENU_STYLES,
                  minWidth: { xs: 34, md: 170 },
                  width: { xs: 34, md: "auto" },
                  flexShrink: 0,
                  "& .MuiChip-icon": {
                    mr: { xs: 0, md: 0.5 },
                  },
                  "& .MuiChip-label": {
                    display: { xs: "none", md: "inline-block" },
                  },
                }}
              />
              {isPublic && isCurrentUserOwner && (
                <Tooltip title="Make board private">
                  <Box component="span" sx={{ flexShrink: 0 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<LockRounded />}
                      onClick={() => setPrivateUpgradeOpen(true)}
                      sx={{
                        minWidth: { xs: 36, md: 64 },
                        px: { xs: 0.75, md: 1.5 },
                        "& .MuiButton-startIcon": {
                          mr: { xs: 0, md: 1 },
                          ml: 0,
                        },
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
                        Make private
                      </Box>
                    </Button>
                  </Box>
                </Tooltip>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 0.75, md: 2 },
            flexShrink: 0,
          }}
        >
          <Tooltip title="Invite member">
            <Box component="span">
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => setInviteOpen(true)}
                disabled={!isBoardReady || !isCurrentUserOwner}
                sx={{
                  minWidth: { xs: 36, md: 64 },
                  px: { xs: 0.75, md: 1.5 },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, md: 1 },
                    ml: 0,
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
                  Invite
                </Box>
              </Button>
            </Box>
          </Tooltip>
          <Tooltip title={`Archived items${archivedItemCount ? ` (${archivedItemCount})` : ""}`}>
            <Box component="span">
              <Button
                variant="outlined"
                startIcon={<Inventory2Rounded />}
                onClick={() => setArchivedOpen(true)}
                disabled={!isBoardReady || !isCurrentUserMember}
                sx={{
                  minWidth: { xs: 36, md: 64 },
                  px: { xs: 0.75, md: 1.5 },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, md: 1 },
                    ml: 0,
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", md: "inline"}}}>
                  Archived
                </Box>
              </Button>
            </Box>
          </Tooltip>
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
                sx={{
                  minWidth: { xs: 36, md: 64 },
                  px: { xs: 0.75, md: 1.5 },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, md: 1 },
                    ml: 0,
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
                  Leave
                </Box>
              </Button>
            </Box>
          </Tooltip>
          <Box
            sx={{
              width: { xs: 70, sm: 78, md: 144 },
              display: "flex",
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            {isBoardReady ? (
              <AvatarGroup
                max={isMobileOrTablet ? 2 : 4}
                sx={{
                  "& .MuiAvatar-root": {
                    width: { xs: 30, sm: 34 },
                    height: { xs: 30, sm: 34 },
                    fontSize: { xs: 14, sm: 16 },
                    backgroundColor: "primary.main",
                  },
                }}
              >
                {members.map((member) => (
                  <Tooltip
                    title={`${member.email}${isOwner(member._id) ? " • Owner" : ""}`}
                    key={member._id}
                  >
                    <Badge
                      overlap="circular"
                      variant="dot"
                      color="success"
                      invisible={!isOnline(member._id)}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      sx={{
                        "& .MuiBadge-dot": {
                          width: 10,
                          height: 10,
                          minWidth: 10,
                          border: "2px solid",
                          borderColor: "background.paper",
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <Avatar
                        alt={member.username}
                        src={member.avatar || undefined}
                      >
                        {HelperUtils.getInitials(member.username)}
                      </Avatar>
                    </Badge>
                  </Tooltip>
                ))}
              </AvatarGroup>
            ) : (
              <AvatarGroup
                max={isMobileOrTablet ? 2 : 4}
                sx={{
                  "& .MuiAvatar-root": {
                    width: { xs: 30, sm: 34 },
                    height: { xs: 30, sm: 34 },
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
        fullScreen={isMobile}
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
                    <Badge
                      overlap="circular"
                      variant="dot"
                      color="success"
                      invisible={!isOnline(member._id)}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      sx={{
                        "& .MuiBadge-dot": {
                          width: 10,
                          height: 10,
                          minWidth: 10,
                          border: "2px solid",
                          borderColor: "background.paper",
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <Avatar alt={member.username} src={member.avatar || undefined}>
                        {HelperUtils.getInitials(member.username)}
                      </Avatar>
                    </Badge>
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
        fullScreen={isMobile}
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
        fullScreen={isMobile}
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
        fullScreen={isMobile}
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
