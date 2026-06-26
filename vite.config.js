import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Bei GitHub Pages liegt die App unter https://<user>.github.io/<repo>/,
// daher muss base auf den Repo-Namen gesetzt werden.
export default defineConfig({
  base: "/Terminplaner/",
  plugins: [react(), tailwindcss()],
});
