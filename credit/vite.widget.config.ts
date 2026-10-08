import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Segundo build del remote: bundle autónomo (IIFE) con React incluido. Sin Module Federation.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": '"production"' }, // en modo librería Vite no lo reemplaza solo
  build: {
    outDir: "dist-widget",
    lib: {
      entry: "src/widget.tsx",
      name: "NovaBankCredit",
      formats: ["iife"],
      fileName: () => "credit-widget.js",
    },
  },
});
