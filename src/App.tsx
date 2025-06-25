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
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

function App() {
  const appRoutes = useRoutes(routes);
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {appRoutes}
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
        <JotaiDevTools store={store} />
      </JotaiProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
