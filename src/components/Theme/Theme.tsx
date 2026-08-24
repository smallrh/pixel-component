import { type CSSProperties, createContext, useContext, type ReactNode } from "react";
import { useConfig } from "../ConfigProvider";

interface TokenMap {
  /** 主色 */
  colorPrimary: string;
  /** 背景色 */
  colorBg: string;
  /** 文本色 */
  colorText: string;
  /** 圆角（px） */
  borderRadius: number;
  /** 字体族 */
  fontFamily: string;
  /** 基础间距（px） */
  spacing: number;
}

const defaultTokens: TokenMap = {
  colorPrimary: "#000",
  colorBg: "#fff",
  colorText: "#000",
  borderRadius: 0,
  fontFamily: "var(--pixel-font)",
  spacing: 4,
};

export const ThemeContext = createContext<TokenMap>(defaultTokens);

export interface ThemeProps {
  /** 局部覆盖的设计令牌，与 ConfigProvider 的主题合并 */
  tokens?: Partial<TokenMap>;
  /** 局部亮/暗模式，优先级高于 ConfigProvider.mode */
  mode?: "light" | "dark";
  /** 子节点，将消费合并后的主题 */
  children: ReactNode;
}

/**
 * Theme。局部主题容器，合并 ConfigProvider 全局主题与局部 tokens 后通过 Context 注入 CSS 变量。
 */
export default function Theme({ tokens, mode, children }: ThemeProps) {
  // 优先消费 ConfigProvider 的 theme + mode，再合并局部 tokens / mode
  const { theme, mode: cfgMode } = useConfig();
  const resolvedMode: "light" | "dark" = mode ?? cfgMode ?? "light";
  const merged = {
    ...defaultTokens,
    colorPrimary: theme.primaryColor ?? defaultTokens.colorPrimary,
    fontFamily: theme.fontFamily ?? defaultTokens.fontFamily,
    borderRadius: theme.borderRadius ?? defaultTokens.borderRadius,
    ...tokens,
  };
  return (
    <ThemeContext.Provider value={merged}>
      <div
        data-theme={resolvedMode}
        style={{
          "--pixel-color-primary": merged.colorPrimary,
          "--pixel-color-bg": merged.colorBg,
          "--pixel-color-text": merged.colorText,
          "--pixel-border-radius": `${merged.borderRadius}px`,
          "--pixel-font-family": merged.fontFamily,
          "--pixel-spacing": `${merged.spacing}px`,
        } as CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** 读取最近 Theme 注入的设计令牌。 */
export function useTheme() {
  return useContext(ThemeContext);
}
