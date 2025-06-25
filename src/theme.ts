import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteOptions } from "@mui/material";

// --- Bổ sung type mở rộng cho `trello` ---
declare module "@mui/material/styles" {
  interface Theme {
    trello: {
      appBarHeight: string;
      boardBarHeight: string;
      boardContentHeight: string;
      columnHeaderHeight: string;
      columnFooterHeight: string;
    };
  }
  interface ThemeOptions {
    trello?: {
      appBarHeight?: string;
      boardBarHeight?: string;
      boardContentHeight?: string;
      columnHeaderHeight?: string;
      columnFooterHeight?: string;
    };
  }
}

const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#172b4d",
          light: "#42526e",
          dark: "#091e42",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#6b778c",
          light: "#8993a4",
          dark: "#5e6c84",
          contrastText: "#ffffff",
        },
        background: {
          default: "#ffffff",
          paper: "#f4f5f7",
        },
        text: {
          primary: "#000000",
          secondary: "#5e6c84",
        },
        divider: "#dfe1e6",
      } as PaletteOptions,
    },
    dark: {
      palette: {
        primary: {
          main: "#b6c2cf",
          light: "#dfe1e6",
          dark: "#9fadbc",
          contrastText: "#1d2125",
        },
        secondary: {
          main: "#8c9bab",
          light: "#b6c2cf",
          dark: "#738496",
          contrastText: "#1d2125",
        },
        background: {
          default: "#000000",
          paper: "#22272b",
        },
        text: {
          primary: "#b6c2cf",
          secondary: "#8c9bab",
        },
        divider: "#454f59",
      } as PaletteOptions,
    },
  },
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdc3c7",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#95a5a6",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontSize: "0.875rem",
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          "&.MuiTypography-body1": { fontSize: "0.875rem" },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontSize: "0.875rem",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.divider,
          },
          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.primary,
            },
          },
          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& fieldset": {
            borderWidth: "1px !important",
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    // MuiModal: {
    //   styleOverrides: {
    //     root: () => ({
    //       ".MuiBox-root": {
    //         padding: 0,
    //       },
    //     }),
    //   },
    // },
  },
} as ThemeOptions);

export default theme;
