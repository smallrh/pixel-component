import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";
  return {
    plugins: [react()],
    server: {
      allowedHosts: ['.monkeycode-ai.live'],
    },
    // lib 模式构建时不复制 public 目录（favicon 等仅用于 demo 站点）
    publicDir: isLib ? false : "public",
    build: isLib
      ? {
          lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            name: "PixelUI",
            formats: ["es", "cjs"],
            fileName: (format) => `pixel-ui.${format === "es" ? "es.js" : "cjs"}`,
          },
          rollupOptions: {
            // 外部化 React，避免库重复打包
            external: ["react", "react-dom", "react/jsx-runtime", "clsx"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                clsx: "clsx",
              },
            },
          },
          sourcemap: true,
        }
      : {},
  };
});
