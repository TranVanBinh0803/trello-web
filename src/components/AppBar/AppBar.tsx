import {
  Box,
  Button,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  MouseEvent,
} from "react";
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
import { useNavigate } from "react-router-dom";
import { useGetMyBoards } from "~/pages/Boards/api/useGetMyBoards";

const AppBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [createAnchorEl, setCreateAnchorEl] = useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchAnchorRef = useRef<HTMLDivElement>(null);
  const accessToken = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(accessToken);
  
  const importBoardMutation = useImportBoard();
  const myBoardsQuery = useGetMyBoards(isLoggedIn);

  const openCreateMenu = Boolean(createAnchorEl);
  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedSearchValue) return [];

    return (myBoardsQuery.data?.data ?? [])
      .filter((board) => {
        const title = board.title.toLowerCase();
        const description = board.description.toLowerCase();
        return (
          title.includes(normalizedSearchValue) ||
          description.includes(normalizedSearchValue)
        );
      })
      .slice(0, 6);
  }, [myBoardsQuery.data?.data, normalizedSearchValue]);
  const openSearchResults = searchFocused && Boolean(normalizedSearchValue);

  const handleSearch = (): void => {
    const firstBoard = searchResults[0];
    if (!firstBoard) {
      setSearchFocused(true);
      return;
    }
    handleOpenBoard(firstBoard._id);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
    setSearchFocused(true);
  };

  const handleOpenBoard = (boardId: string) => {
    setSearchValue("");
    setSearchFocused(false);
    navigate(`/boards/${boardId}`);
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
        gap: { xs: 1, sm: 2 },
        overflowX: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
        <Box
          component="button"
          type="button"
          aria-label="Go to boards"
          onClick={() => navigate("/boards")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            p: 0,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            color: "primary.main",
          }}
        >
          <AppsIcon sx={{ color: "primary.main" }} />
          <Typography
            component="span"
            sx={{
              display: { xs: "none", sm: "inline" },
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Trolle
          </Typography>
        </Box>
        {isLoggedIn && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="primary"
            aria-label="Create"
            onClick={handleOpenCreateMenu}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <LibraryAddIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<LibraryAddIcon />}
            onClick={handleOpenCreateMenu}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
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
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
        <ClickAwayListener onClickAway={() => setSearchFocused(false)}>
          <Box ref={searchAnchorRef} sx={{ position: "relative" }}>
            <TextField
              id="outlined-search"
              type="search"
              size="small"
              placeholder="Search boards"
              value={searchValue}
              onChange={handleChange}
              onFocus={() => setSearchFocused(true)}
              disabled={!isLoggedIn}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              sx={{
                minWidth: { xs: 132, sm: 150 },
                maxWidth: { xs: 156, sm: 210 },
              }}
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
            <Popper
              open={openSearchResults}
              anchorEl={searchAnchorRef.current}
              placement="bottom-end"
              sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
            >
              <Paper
                elevation={8}
                sx={{
                  mt: 1,
                  width: { xs: 260, sm: 340 },
                  maxHeight: 360,
                  overflowY: "auto",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ px: 1.5, pt: 1.25, pb: 0.5 }}>
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="text.secondary"
                  >
                    Boards
                  </Typography>
                </Box>
                <List dense disablePadding>
                  {searchResults.length === 0 ? (
                    <ListItemButton disabled>
                      <ListItemText
                        primary="No boards found"
                        secondary="Try another board name or description"
                      />
                    </ListItemButton>
                  ) : (
                    searchResults.map((board) => (
                      <ListItemButton
                        key={board._id}
                        onClick={() => handleOpenBoard(board._id)}
                        sx={{ alignItems: "flex-start", px: 1.5, py: 1 }}
                      >
                        <ListItemText
                          primary={board.title}
                          secondary={board.description}
                          primaryTypographyProps={{ fontWeight: 700 }}
                          secondaryTypographyProps={{
                            sx: {
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))
                  )}
                </List>
              </Paper>
            </Popper>
          </Box>
        </ClickAwayListener>

        <ModeSelect />
        {isLoggedIn ? (
          <>
            <Notifications />
            <Profiles />
          </>
        ) : (
          <Button variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AppBar;
