import { createContext, useContext, type ReactNode } from "react";

export interface LocaleMessages {
  [key: string]: string;
}

export interface LocalePack {
  locale: string;
  messages: LocaleMessages;
}

/* 内置默认英文文案（组件通过 t() 读取，可被 LocaleProvider 覆盖） */
const enMessages: LocaleMessages = {
  "input.showPassword": "Show password",
  "input.hidePassword": "Hide password",
  "input.search": "Search",
  "table.empty": "No data",
  "upload.trigger": "Upload",
  "select.placeholder": "Select...",
  "cascader.placeholder": "Select...",
  "autocomplete.placeholder": "Search...",
  "datepicker.placeholder": "YYYY-MM-DD",
};

const defaultLocalePack: LocalePack = {
  locale: "en",
  messages: enMessages,
};

export const LocaleContext = createContext<LocalePack>(defaultLocalePack);

export interface LocaleProviderProps {
  locale?: LocalePack;
  children: ReactNode;
}

export default function LocaleProvider({
  locale,
  children,
}: LocaleProviderProps) {
  // 与内置英文包合并，未覆盖的 key 回退到英文
  const merged = locale
    ? {
        locale: locale.locale,
        messages: { ...enMessages, ...locale.messages },
      }
    : defaultLocalePack;
  return (
    <LocaleContext.Provider value={merged}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function t(key: string, messages: LocaleMessages): string {
  return messages[key] ?? key;
}
