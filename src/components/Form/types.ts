import { createContext } from "react";

/* ===== 类型 ===== */

export interface FormRule {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => string | undefined | Promise<string | undefined>;
}

export type FieldValue = unknown;

export interface FieldHandle {
  name: string;
  rules?: FormRule[];
  getValue: () => FieldValue;
  setValue: (v: FieldValue) => void;
}

export interface FormContextValue {
  registerField: (h: FieldHandle) => void;
  unregisterField: (name: string) => void;
  errors: Record<string, string>;
  setError: (name: string, message?: string) => void;
  setFieldValue: (name: string, v: FieldValue) => void;
  /** 初始值（Form initialValues 透传） */
  initialValues?: Record<string, unknown>;
  /** 值变化回调（仅携带本次变更字段，由 Form 层维护全量值） */
  onValuesChange?: (changed: Record<string, unknown>) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);
