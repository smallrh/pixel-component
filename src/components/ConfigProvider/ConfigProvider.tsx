import { type CSSProperties, createContext, useContext, type ReactNode } from "react";

export interface PixelTheme {
  /** 主色 */
  primaryColor?: string;
  /** 字体族 */
  fontFamily?: string;
  /** 圆角（px） */
  borderRadius?: number;
}

interface ConfigContextValue {
  theme: PixelTheme;
  locale?: string;
  /** 亮/暗模式："light" | "dark"，默认 "light"（通过 [data-theme="dark"] 切换语义颜色变量） */
  mode?: "light" | "dark";
}

const defaultTheme: PixelTheme = {
  primaryColor: "#000",
  fontFamily: "var(--pixel-font)",
};

const ConfigContext = createContext<ConfigContextValue>({
  theme: defaultTheme,
  mode: "light",
});

export interface ConfigProviderProps {
  /** 全局主题令牌，与默认主题浅合并 */
  theme?: PixelTheme;
  /** 语言标识，默认 "en" */
  locale?: string;
  /** 亮/暗模式，默认 "light"。切换后容器设置 [data-theme="dark"|"light"] 触发语义变量切换。 */
  mode?: "light" | "dark";
  /** 子节点 */
  children: ReactNode;
}

/**
 * ConfigProvider。全局配置容器，向子树注入主题与语言，并将关键令牌写入 CSS 变量。
 */
export default function ConfigProvider({
  theme,
  locale = "en",
  mode = "light",
  children,
}: ConfigProviderProps) {
  const mergedTheme = { ...defaultTheme, ...theme };
  return (
    <ConfigContext.Provider value={{ theme: mergedTheme, locale, mode }}>
      <div
        data-theme={mode}
        style={{
          "--pixel-color-primary": mergedTheme.primaryColor,
          "--pixel-font-family": mergedTheme.fontFamily,
          "--pixel-border-radius": `${mergedTheme.borderRadius ?? 0}px`,
        } as CSSProperties}
      >
        {children}
      </div>
    </ConfigContext.Provider>
  );
}

/** 读取最近的 ConfigProvider 配置（主题与语言）。 */
export function useConfig() {
  return useContext(ConfigContext);
}
