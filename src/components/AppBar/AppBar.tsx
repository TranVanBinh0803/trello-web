import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState, ChangeEvent, MouseEvent } from "react";
import ModeSelect from "../ModeSelect/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Profiles from "./Menus/Profiles";
import SearchIcon from "@mui/icons-material/Search";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { accessTokenAtom } from "~/atoms/AuthAtoms";
import { useImportBoard } from "./api/useImportBoard";
import { API_ROOT } from "~/untils/constants";
import Notifications from "./Menus/Notifications";

const AppBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [createAnchorEl, setCreateAnchorEl] = useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useAtomValue(accessTokenAtom);
  
  const importBoardMutation = useImportBoard();

  const openCreateMenu = Boolean(createAnchorEl);

  const handleSearch = (): void => {
    console.log("Click search:", searchValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const handleOpenCreateMenu = (event: MouseEvent<HTMLElement>) => {
    setCreateAnchorEl(event.currentTarget);
  };

  const handleCloseCreateMenu = () => {
    setCreateAnchorEl(null);
  };

  const handleDownloadImportSample = () => {
    const downloadTemplate = async () => {
      const response = await fetch(`${API_ROOT}/boards/import-template`, {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      });
      if (!response.ok) {
        throw new Error("Failed to download import template");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "trello-board-import-template.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    };

    downloadTemplate().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to download template";
      toast.error(message);
    });
    handleCloseCreateMenu();
  };

  const handleChooseImportFile = () => {
    fileInputRef.current?.click();
    handleCloseCreateMenu();
  };

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    importBoardMutation.mutate(file);
  };

  return (
    <Box
      px={2}
      sx={{
        display: "flex",
        alignItems: "center",
        height: (theme) => theme.trello.appBarHeight,
        width: "100%",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            component="span"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<LibraryAddIcon />}
            onClick={handleOpenCreateMenu}
          >
            Create
          </Button>
          <Menu
            anchorEl={createAnchorEl}
            open={openCreateMenu}
            onClose={handleCloseCreateMenu}
          >
            <MenuItem onClick={handleDownloadImportSample}>
              Download Excel import sample
            </MenuItem>
            <MenuItem onClick={handleChooseImportFile}>
              Import board from Excel
            </MenuItem>
          </Menu>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            hidden
            onChange={handleImportFileChange}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          type="search"
          size="small"
          value={searchValue}
          onChange={handleChange}
          sx={{ minWidth: "120px", maxWidth: "170px" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    onClick={handleSearch}
                    sx={{ cursor: "pointer", color: "primary.main" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <ModeSelect />
        <Notifications/>
        <Profiles />
      </Box>
    </Box>
  );
};

export default AppBar;
