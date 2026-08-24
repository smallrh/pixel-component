import { useCallback, useRef, useState } from "react";
import type { FieldHandle } from "./types";
import { runRules } from "./rules";

/**
 * 表单实例。泛型 V 为表单值的形状，默认 `Record<string, unknown>`。
 * 泛型推断示例：
 * ```ts
 * interface MyForm { name: string; age: number; }
 * const form = useForm<MyForm>();
 * form.getFieldsValue()      // MyForm
 * form.setFieldValue("age", 30)  // 类型安全
 * form.getFieldValue("name")    // string
 * ```
 */
export interface FormInstance<V extends Record<string, unknown> = Record<string, unknown>> {
  validate: () => Promise<boolean>;
  setFieldValue: <K extends string & keyof V>(name: K, value: V[K]) => void;
  setFieldsValue: (values: Partial<V>) => void;
  getFieldsValue: () => V;
  getFieldValue: <K extends string & keyof V>(name: K) => V[K];
  resetFields: () => void;
  getErrors: () => Record<string, string>;
  setError: (name: string, message?: string) => void;
  registerField: (h: FieldHandle) => void;
  unregisterField: (name: string) => void;
  /** @internal 由 Form 渲染时注入 locale 消息（用于内置校验文案） */
  _setMessages: (messages: Record<string, string>) => void;
}

export function useForm<V extends Record<string, unknown> = Record<string, unknown>>(): FormInstance<V> {
  const fieldsRef = useRef<Map<string, FieldHandle>>(new Map());
  const [, setErrors] = useState<Record<string, string>>({});
  const errorsRef = useRef<Record<string, string>>({});
  // locale 消息（由 Form 渲染时注入，用于内置校验文案）
  const messagesRef = useRef<Record<string, string>>({});

  const setMessages = useCallback((messages: Record<string, string>) => {
    messagesRef.current = messages;
  }, []);

  const registerField = useCallback((h: FieldHandle) => {
    fieldsRef.current.set(h.name, h);
  }, []);

  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name);
  }, []);

  const setError = useCallback((name: string, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message === undefined) delete next[name];
      else next[name] = message;
      errorsRef.current = next;
      return next;
    });
  }, []);

  const validate = useCallback(async () => {
    const nextErrors: Record<string, string> = {};
    for (const [name, field] of fieldsRef.current) {
      const value = field.getValue();
      const message = await runRules(value, field.rules, messagesRef.current);
      if (message) nextErrors[name] = message;
    }
    errorsRef.current = nextErrors;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);

  const setFieldValue = useCallback((name: string, value: unknown) => {
    fieldsRef.current.get(name)?.setValue(value);
  }, []);

  const setFieldsValue = useCallback((values: Record<string, unknown>) => {
    for (const [name, value] of Object.entries(values)) {
      fieldsRef.current.get(name)?.setValue(value);
    }
  }, []);

  const getFieldValue = useCallback(
    (<K extends string & keyof V>(name: K) =>
      fieldsRef.current.get(name)?.getValue() as V[K])
  , []) as FormInstance<V>["getFieldValue"];

  const getFieldsValue = useCallback(
    () =>
      Object.fromEntries(
        [...fieldsRef.current.entries()].map(([name, h]) => [name, h.getValue()])
      ) as V,
    []
  );

  const resetFields = useCallback(() => {
    fieldsRef.current.forEach((h) => h.setValue(""));
  }, []);

  return {
    validate,
    setFieldValue,
    setFieldsValue,
    getFieldsValue,
    getFieldValue,
    resetFields,
    getErrors: () => errorsRef.current,
    setError,
    registerField,
    unregisterField,
    _setMessages: setMessages,
  };
}
