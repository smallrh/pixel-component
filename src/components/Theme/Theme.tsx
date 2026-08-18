import { type CSSProperties, createContext, useContext, type ReactNode } from "react";
import { useConfig } from "../ConfigProvider";

interface TokenMap {
  colorPrimary: string;
  colorBg: string;
  colorText: string;
  borderRadius: number;
  fontFamily: string;
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
  tokens?: Partial<TokenMap>;
  children: ReactNode;
}

export default function Theme({ tokens, children }: ThemeProps) {
  // 优先消费 ConfigProvider 的 theme，再合并局部 tokens
  const { theme } = useConfig();
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

export function useTheme() {
  return useContext(ThemeContext);
}
