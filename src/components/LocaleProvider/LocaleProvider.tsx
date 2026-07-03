import { createContext, useContext, type ReactNode } from "react";

export interface LocaleMessages {
  [key: string]: string;
}

export interface LocalePack {
  locale: string;
  messages: LocaleMessages;
}

const defaultLocalePack: LocalePack = {
  locale: "en",
  messages: {},
};

export const LocaleContext = createContext<LocalePack>(defaultLocalePack);

interface LocaleProviderProps {
  locale?: LocalePack;
  children: ReactNode;
}

export default function LocaleProvider({
  locale = defaultLocalePack,
  children,
}: LocaleProviderProps) {
  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function t(key: string, messages: LocaleMessages): string {
  return messages[key] ?? key;
}