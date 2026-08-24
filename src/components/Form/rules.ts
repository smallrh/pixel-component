import { t } from "../LocaleProvider";
import type { FieldValue, FormRule } from "./types";

/** 校验单字段：按 rules 顺序执行，返回第一条命中的错误信息（无错误返回 undefined） */
export async function runRules(
  value: FieldValue,
  rules: FormRule[] | undefined,
  messages: { [key: string]: string }
): Promise<string | undefined> {
  if (!rules) return undefined;
  for (const rule of rules) {
    const isEmpty = value === undefined || value === null || value === "";
    if (rule.required && isEmpty) {
      return rule.message ?? t("form.required", messages);
    }
    if (!isEmpty && rule.min !== undefined && typeof value === "number" && value < rule.min) {
      return rule.message ?? t("form.min.value", messages, { min: rule.min });
    }
    if (!isEmpty && rule.max !== undefined && typeof value === "number" && value > rule.max) {
      return rule.message ?? t("form.max.value", messages, { max: rule.max });
    }
    if (!isEmpty && rule.min !== undefined && typeof value === "string" && value.length < rule.min) {
      return rule.message ?? t("form.min.length", messages, { min: rule.min });
    }
    if (!isEmpty && rule.max !== undefined && typeof value === "string" && value.length > rule.max) {
      return rule.message ?? t("form.max.length", messages, { max: rule.max });
    }
    if (!isEmpty && rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message ?? t("form.pattern", messages);
    }
    if (rule.validator) {
      const result = await rule.validator(value);
      if (result) return result;
    }
  }
  return undefined;
}
