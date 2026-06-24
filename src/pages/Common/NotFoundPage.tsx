import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

import { accessTokenAtom } from "~/atoms/AuthAtoms";

const COLUMN_ITEMS = [
  ["Backlog", "Missing route", "Broken link"],
  ["Checking", "Looking around", "Almost there"],
  ["Recovered", "Go home", "Open boards"],
];

export function NotFoundPage() {
  const navigate = useNavigate();
  const accessToken = useAtomValue(accessTokenAtom);
  const homePath = accessToken ? "/boards" : "/login";

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at top left, #1d2733, #000 54%)"
            : "radial-gradient(circle at top left, #e9f2ff, #ffffff 58%)",
      })}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 4, md: 8 }}
        sx={{ width: "100%", maxWidth: 1080 }}
      >
        <Stack spacing={3} sx={{ maxWidth: 480 }}>
          <Box
            sx={{
              width: "fit-content",
              px: 1.5,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
              bgcolor: "background.paper",
              color: "text.secondary",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            404 PAGE
          </Box>

          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 44, sm: 58, md: 68 },
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: 0,
              }}
            >
              Page wandered off.
            </Typography>
            <Typography
              sx={{
                mt: 2,
                color: "text.secondary",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.6,
              }}
            >
              The board you are looking for is not available, moved, or the
              link is not quite right.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
            <Button
              variant="contained"
              startIcon={accessToken ? <DashboardRoundedIcon /> : <HomeRoundedIcon />}
              onClick={() => navigate(homePath)}
              sx={{ minHeight: 44 }}
            >
              {accessToken ? "Go to boards" : "Go to sign in"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{ minHeight: 44 }}
            >
              Go back
            </Button>
          </Stack>
        </Stack>

        <Box
          aria-hidden
          sx={{
            width: { xs: "100%", sm: 420, md: 480 },
            maxWidth: "100%",
            p: { xs: 2, sm: 3 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 24px 70px rgba(0, 0, 0, 0.5)"
                : "0 24px 70px rgba(9, 30, 66, 0.12)",
            transform: { md: "rotate(-2deg)" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 72, sm: 96 },
              lineHeight: 0.9,
              fontWeight: 900,
              color: "primary.main",
              letterSpacing: 0,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Stack direction="row" gap={1.25} alignItems="stretch">
            {COLUMN_ITEMS.map((column, columnIndex) => (
              <Stack
                key={column[0]}
                gap={1}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {column.map((item, itemIndex) => (
                  <Box
                    key={item}
                    sx={{
                      minHeight: itemIndex === 0 ? 30 : 42,
                      px: 1,
                      py: 0.75,
                      borderRadius: 1.5,
                      bgcolor:
                        itemIndex === 0
                          ? "transparent"
                          : columnIndex === 2
                            ? "success.main"
                            : "background.paper",
                      color:
                        itemIndex === 0
                          ? "text.secondary"
                          : columnIndex === 2
                            ? "success.contrastText"
                            : "text.primary",
                      border: itemIndex === 0 ? "none" : "1px solid",
                      borderColor: "divider",
                      fontSize: itemIndex === 0 ? 12 : 13,
                      fontWeight: itemIndex === 0 ? 800 : 650,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
