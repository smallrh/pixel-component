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
  "empty.noData": "No data",
  "upload.trigger": "Upload",
  "select.placeholder": "Select...",
  "cascader.placeholder": "Select...",
  "treeselect.placeholder": "Select...",
  "datepicker.placeholder": "YYYY-MM-DD",
  "timepicker.ok": "OK",
  "popconfirm.ok": "OK",
  "popconfirm.cancel": "Cancel",
  "tour.next": "Next",
  "tour.done": "Done",
  "form.required": "This field is required",
  "form.min.value": "Minimum value is {min}",
  "form.max.value": "Maximum value is {max}",
  "form.min.length": "Minimum length is {min}",
  "form.max.length": "Maximum length is {max}",
  "form.pattern": "Invalid format",
  "table.loading": "Loading...",
  "close": "Close",
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

/**
 * 取文案：扁平查找 key（未命中回退到 key 本身）。
 * @param params 可选的插值参数，将模板中的 `{name}` 占位符替换为对应值。
 *   示例：t("form.min.value", messages, { min: 3 }) → "Minimum value is 3"
 */
export function t(
  key: string,
  messages: LocaleMessages,
  params?: Record<string, string | number>
): string {
  const raw = messages[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    params[name] !== undefined ? String(params[name]) : `{${name}}`
  );
}
