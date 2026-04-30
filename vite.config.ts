import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    react(),
    babel({
      presets: [reactCompilerPreset()]
    })
  ],
  resolve: {
    tsconfigPaths: true
  }
});
