import { createRoot } from "react-dom/client";
import App from "~/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "~/theme";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { DevTools as JotaiDevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";
import { store } from "./atoms/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./apis/queryClient";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <JotaiProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-right" />
      </ThemeProvider>
      <JotaiDevTools store={store} />
    </JotaiProvider>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  </QueryClientProvider>
);
