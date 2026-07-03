import { createContext, useContext, type ReactNode } from "react";

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
  fontFamily: "monospace",
  spacing: 4,
};

export const ThemeContext = createContext<TokenMap>(defaultTokens);

interface ThemeProps {
  tokens?: Partial<TokenMap>;
  children: ReactNode;
}

export default function Theme({ tokens, children }: ThemeProps) {
  const merged = { ...defaultTokens, ...tokens };
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
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}