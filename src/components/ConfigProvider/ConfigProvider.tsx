import React, { createContext, useContext, type ReactNode } from "react";

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
  fontFamily: "monospace",
};

const ConfigContext = createContext<ConfigContextValue>({
  theme: defaultTheme,
});

interface ConfigProviderProps {
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
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}