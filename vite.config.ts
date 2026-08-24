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
          // 字体去内联由 scripts/extract-fonts.mjs 在构建后处理
          // （Vite lib 模式会强制内联 CSS 中引用的资源，assetsInlineLimit 无效）
          // 不自动清空 outDir（批量删除会触发安全策略确认，由构建后脚本处理残留）
          emptyOutDir: false,
          cssCodeSplit: true,
          sourcemap: true,
          // 产物语法降级目标，与 package.json browserslist 对齐（ES2020 ≈ Chrome 80+/FF 80+/Safari 14+）
          target: "es2020",
        }
      : {},
  };
});

