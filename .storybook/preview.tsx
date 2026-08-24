import type { Preview } from "@storybook/react";
import React from "react";
// 引入全局 CSS 变量与像素字体（组件 CSS 由 story 所引组件自身的 css import 带入）
import "../src/styles/global.css";
// 引入 LocaleProvider、ConfigProvider、Theme 以包装 stories（保持真实运行环境）
import { ConfigProvider, LocaleProvider, Theme } from "../src";

type PixelMode = "light" | "dark";

const preview: Preview = {
  // Toolbar 主题切换下拉：所有 story 都可切换 light/dark
  globalTypes: {
    pixelMode: {
      name: "Theme",
      description: "切换像素组件库的亮/暗色主题",
      defaultValue: "light" as PixelMode,
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light Mode", icon: "sun" },
          { value: "dark", title: "Dark Mode", icon: "moon" },
        ],
        dynamicTitle: true,
        showName: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Welcome",
          ["Introduction"],
          "Components",
          ["General", "Layout", "Navigation", "Data Entry", "Data Display", "Feedback"],
        ],
      },
    },
    // backgrounds 也同步亮/暗，便于视觉对比（不强制，仅作为画框背景）
    backgrounds: {
      default: "Light",
      values: [
        { name: "Light", value: "#f0f0f0" },
        { name: "Dark", value: "#141414" },
      ],
    },
  },
  decorators: [
    // 所有 story 都包上 LocaleProvider + ConfigProvider + Theme，
    // 确保像素字体、CSS 变量、国际化上下文与实际使用完全一致。
    (Story, context) => {
      const mode = (context.globals?.pixelMode as PixelMode) ?? "light";
      // 亮/暗 story 画布底色：与 backgrounds 工具栏选项匹配
      const canvasBg = mode === "dark" ? "#141414" : "#f0f0f0";
      return (
        <LocaleProvider>
          <ConfigProvider mode={mode}>
            <Theme mode={mode}>
              <div
                data-theme={mode}
                style={{
                  padding: 24,
                  background: canvasBg,
                  minHeight: "100vh",
                }}
              >
                <Story />
              </div>
            </Theme>
          </ConfigProvider>
        </LocaleProvider>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
