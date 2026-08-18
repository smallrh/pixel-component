import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// 测试专用配置（vitest 使用），与主 vite.config.ts 分离避免干扰 lib 构建
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // 默认 forks 池在 jsdom 多文件场景下会出现 worker 不退出、进程挂起的问题，
    // 改用 threads 池可确保测试跑完后进程正常退出（EXIT 0）。
    pool: "threads",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    restoreMocks: true,
    clearMocks: true,
  },
});
