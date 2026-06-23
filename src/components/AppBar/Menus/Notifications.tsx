import { Badge, Box, Button, MenuItem, Typography } from "@mui/material";
import React, { MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "~/atoms/AuthAtoms";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  useAcceptBoardInvitation,
  useBoardInvitations,
  useRejectBoardInvitation,
} from "../api/useBoardInvitations";

const NO_CONTENT_IMAGE = "/img/No-content.svg";

const Notifications: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const accessToken = useAtomValue(accessTokenAtom);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const boardInvitationsQuery = useBoardInvitations(Boolean(accessToken));
  const acceptBoardInvitationMutation = useAcceptBoardInvitation();
  const rejectBoardInvitationMutation = useRejectBoardInvitation();

  const boardInvitations = boardInvitationsQuery.data?.data ?? [];
  const pendingInvitations = boardInvitations.filter(
    (invitation) => invitation.status === "pending"
  );
  const pendingInvitationCount = pendingInvitations.length;

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          badgeContent={pendingInvitationCount}
          color="error"
          max={99}
          invisible={pendingInvitationCount === 0}
        >
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? "notification-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <NotificationsNoneIcon
              sx={{ cursor: "pointer", color: "primary.main" }}
            />
          </IconButton>
        </Badge>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="notification-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              paddingX: 2,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {pendingInvitations.length === 0 ? (
          <Box
            sx={{
              width: 260,
              px: 3,
              py: 2.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src={NO_CONTENT_IMAGE}
              alt="No board invitations"
              sx={{
                width: 120,
                height: 120,
                objectFit: "contain",
              }}
            />
            <Typography fontWeight={600} color="text.secondary">
              No board invitations
            </Typography>
          </Box>
        ) : (
          pendingInvitations.map((invitation) => (
            <MenuItem
              key={invitation._id}
              disableRipple
              sx={{
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 1,
                whiteSpace: "normal",
              }}
            >
              <Box>
                <Typography fontWeight={600}>
                  {invitation.board.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invited by {invitation.inviter.username}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={acceptBoardInvitationMutation.isPending}
                  onClick={() =>
                    acceptBoardInvitationMutation.mutate(invitation._id)
                  }
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  disabled={rejectBoardInvitationMutation.isPending}
                  onClick={() =>
                    rejectBoardInvitationMutation.mutate(invitation._id)
                  }
                >
                  Reject
                </Button>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default Notifications;
