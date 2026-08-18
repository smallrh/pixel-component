import { type CSSProperties, createContext, useContext, type ReactNode } from "react";

export interface PixelTheme {
  primaryColor?: string;
  fontFamily?: string;
  borderRadius?: number;
}

interface ConfigContextValue {
  theme: PixelTheme;
  locale?: string;
}

const defaultTheme: PixelTheme = {
  primaryColor: "#000",
  fontFamily: "var(--pixel-font)",
};

const ConfigContext = createContext<ConfigContextValue>({
  theme: defaultTheme,
});

export interface ConfigProviderProps {
  theme?: PixelTheme;
  locale?: string;
  children: ReactNode;
}

export default function ConfigProvider({
  theme,
  locale = "en",
  children,
}: ConfigProviderProps) {
  const mergedTheme = { ...defaultTheme, ...theme };
  return (
    <ConfigContext.Provider value={{ theme: mergedTheme, locale }}>
      <div
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

export function useConfig() {
  return useContext(ConfigContext);
}
