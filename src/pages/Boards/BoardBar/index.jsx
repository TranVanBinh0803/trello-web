import {
  AddToDriveOutlined,
  DashboardRounded,
  PersonAdd,
  VpnLockOutlined,
} from "@mui/icons-material";
import { Box,  Button,  Chip } from "@mui/material";
import React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

const MENU_STYLES = {
  color: "primary.main",
  backgroundColor: "white",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  "&: hover": {
    bgcolor: "primary.50",
  },
};

const BoardBar = () => {
  return (
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
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          icon={<DashboardRounded color="primary.main" />}
          label="Dashboard"
          sx={MENU_STYLES}
          clickable
        />
        <Chip
          icon={<VpnLockOutlined color="primary.main" />}
          label="Public/Private Workspace"
          sx={MENU_STYLES}
          clickable
        />
        <Chip
          icon={<AddToDriveOutlined color="primary.main" />}
          label="Add to google drive"
          sx={MENU_STYLES}
          clickable
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button variant="outlined"  startIcon={<PersonAdd/>}>Invite</Button>
        <AvatarGroup
          max={4}
          sx={{
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              backgroundColor: 'primary.main'
            },
          }}
        >
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default BoardBar;
