import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, // important
      svgrOptions: {
        exportType: "named", // allows ReactComponent named export
      },
    }),
  ],
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
