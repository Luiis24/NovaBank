import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
export default defineConfig({
  base: "/remotes/credit/",
  plugins: [
    react(),
    federation({
      name: "credit",
      filename: "remoteEntry.js",
      exposes: { "./App": "./src/App.tsx" },
      dts: false,
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
  build: { target: "esnext" },
});
