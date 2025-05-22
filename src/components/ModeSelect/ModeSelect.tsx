import React from "react";
import { Box, useColorScheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ModeSelect: React.FC = () => {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event: SelectChangeEvent) => {
    const selectedMode = event.target.value as "light" | "dark" | "system";
    setMode(selectedMode);
  };

  return (
    <FormControl size="small" sx={{ minWidth: "120px" }}>
      <Select
        value={mode || "light"}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem value="system">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
        <MenuItem value="light">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeIcon fontSize="small" />
            Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DarkModeIcon fontSize="small" />
            Dark
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ModeSelect;
