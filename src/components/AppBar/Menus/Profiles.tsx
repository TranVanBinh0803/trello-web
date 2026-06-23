import React, { ChangeEvent, FormEvent, MouseEvent } from "react";

import Logout from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { getABoardApiSpec } from "~/apis/services/board/Board";
import { getBoardInvitationsApiSpec } from "~/apis/services/user/User";
import { user } from "~/atoms/AuthAtoms";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { useSignOut } from "~/hooks/auth/useSignOut";
import { BoardType } from "~/types/board";
import { RestResponse } from "~/types/common";
import { UserType } from "~/types/user";
import { HelperUtils } from "~/untils/helpers";
import { useUpdateProfile } from "../api/useUpdateProfile";

const syncBoardMemberProfile = (board: BoardType, updatedUser: UserType) => ({
  ...board,
  members: board.members?.map((member) =>
    member._id === updatedUser._id ? { ...member, ...updatedUser } : member
  ),
});

const Profiles: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState("");
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [userAtom, setUserAtom] = useAtom(user);
  const [, setBoardData] = useAtom(boardDataAtom);
  const open = Boolean(anchorEl);

  const signOut = useSignOut();
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const trimmedUsername = username.trim();
  const isUsernameValid = trimmedUsername.length >= 3;
  const isAvatarFileValid = !avatarFile || avatarFile.type.startsWith("image/");
  const shouldShowAvatarError = Boolean(avatarFile) && !isAvatarFileValid;
  const isSaveDisabled =
    !isUsernameValid || !isAvatarFileValid || updateProfileMutation.isPending;

  React.useEffect(() => {
    if (!profileOpen) return;
    setUsername(userAtom?.username ?? "");
    setAvatarFile(null);
    setAvatarPreview(userAtom?.avatar ?? "");
  }, [profileOpen, userAtom]);

  React.useEffect(() => {
    if (!avatarFile) return undefined;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    setAnchorEl(null);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleChooseAvatar = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setAvatarFile(file);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await signOut();
  };

  const handleSubmitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaveDisabled) return;

    const response = await updateProfileMutation.mutateAsync({
      username: trimmedUsername,
      avatarFile,
    });
    const updatedUser = response.data;
    setUserAtom(updatedUser);
    setBoardData((currentBoard) =>
      currentBoard ? syncBoardMemberProfile(currentBoard, updatedUser) : currentBoard
    );
    queryClient.setQueriesData<RestResponse<BoardType>>(
      { queryKey: [getABoardApiSpec.name] },
      (currentData) =>
        currentData?.data
          ? {
              ...currentData,
              data: syncBoardMemberProfile(currentData.data, updatedUser),
            }
          : currentData
    );
    await queryClient.invalidateQueries({
      queryKey: [getBoardInvitationsApiSpec.name],
    });
    await queryClient.invalidateQueries({ queryKey: [getABoardApiSpec.name] });
    setProfileOpen(false);
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {userAtom?.avatar ? (
            <Avatar alt={userAtom?.username} src={userAtom?.avatar} />
          ) : (
            <Avatar
              sx={{
                width: 34,
                height: 34,
                backgroundColor: "primary.main",
                fontSize: "13px",
              }}
            >
              {HelperUtils.getInitials(userAtom?.username)}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
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
        <MenuItem onClick={handleOpenProfile}>
          <Avatar src={userAtom?.avatar || undefined}>
            {HelperUtils.getInitials(userAtom?.username)}
          </Avatar>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Dialog
        open={profileOpen}
        onClose={handleCloseProfile}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleSubmitProfile}>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pt: 1,
            }}
          >
            <Avatar
              alt={trimmedUsername}
              src={avatarPreview || undefined}
              sx={{
                width: 88,
                height: 88,
                bgcolor: "primary.main",
                fontSize: 28,
              }}
            >
              {HelperUtils.getInitials(trimmedUsername)}
            </Avatar>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <Button variant="outlined" onClick={handleChooseAvatar}>
              Upload avatar
            </Button>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              error={Boolean(trimmedUsername) && !isUsernameValid}
              helperText={
                Boolean(trimmedUsername) && !isUsernameValid
                  ? "Username must be at least 3 characters"
                  : " "
              }
            />
            {shouldShowAvatarError && (
              <Box sx={{ width: "100%", color: "error.main", fontSize: 13 }}>
                Avatar must be an image file
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Profiles;
