import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(async ({ mode }) => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;
  
  return {
    test: {
      env: loadEnv(mode, process.cwd(), ""),
    },
    plugins: [tsconfigPaths({ projects: ["."] })],
  };
});
