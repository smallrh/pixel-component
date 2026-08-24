import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import { useLocale } from "../LocaleProvider";
import { FormContext } from "./types";
import type { FormContextValue } from "./types";
import { useForm, type FormInstance } from "./useForm";

// 重新导出，保持 `from "./Form"` 导入路径向后兼容
export { useForm } from "./useForm";
export type { FormInstance } from "./useForm";
export { FormItem } from "./FormItem";
export type { FormRule } from "./types";

export interface FormProps<V extends Record<string, unknown> = Record<string, unknown>> {
  children: ReactNode;
  /** 受控表单实例（由 useForm 创建）；未传时使用内部实例 */
  form?: FormInstance<V>;
  /** 表单初始值（优先级高于子控件 defaultValue/value） */
  initialValues?: Partial<V>;
  /** 校验通过时回调，values 为强类型 V */
  onFinish?: (values: V) => void;
  onFinishFailed?: (errors: Record<string, string>) => void;
  /** 任意字段值变化时触发（values 为全量当前值，changedValues 为本次变更） */
  onValuesChange?: (values: V, changedValues: Partial<V>) => void;
  className?: string;
  style?: CSSProperties;
  /** React 19 ref-as-prop：指向 <form> 元素 */
  ref?: Ref<HTMLFormElement>;
}

/**
 * 表单组件。泛型 V 为表单值的形状，可显式声明或由 initialValues 推断：
 * ```ts
 * interface MyForm { name: string; age: number; }
 * const form = useForm<MyForm>();
 * <Form<MyForm> form={form} onFinish={(v) => console.log(v.name)} />  // v: MyForm
 * ```
 */
function Form<V extends Record<string, unknown> = Record<string, unknown>>({
  children,
  form: formProp,
  initialValues,
  onFinish,
  onFinishFailed,
  onValuesChange,
  className,
  style,
  ref,
}: FormProps<V>) {
  const internal = useForm<V>();
  const form = (formProp ?? internal) as FormInstance<V>;
  const { messages } = useLocale();
  const errors = form.getErrors();

  // 注入 locale 消息，供内置校验文案（required 等）使用
  useEffect(() => {
    form._setMessages?.(messages);
  }, [form, messages]);

  // 维护全量值（供 onValuesChange 使用，避免读字段 ref 的滞后值）
  const [, setValues] = useState<Record<string, unknown>>({});
  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;
  const handleValuesChange = useCallback((changed: Record<string, unknown>) => {
    setValues((prev) => {
      const next = { ...prev, ...changed };
      // 内部 context 以 unknown 传递，此处桥接到强类型 V
      onValuesChangeRef.current?.(next as V, changed as Partial<V>);
      return next;
    });
  }, []);

  const contextValue = useMemo<FormContextValue>(
    () => ({
      registerField: form.registerField,
      unregisterField: form.unregisterField,
      errors,
      setError: (name, message) => form.setError(name, message),
      setFieldValue: (name, v) => form.setFieldValue(name, v as V[string & keyof V]),
      initialValues,
      onValuesChange: handleValuesChange,
    }),
    [form, errors, initialValues, handleValuesChange]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await form.validate();
    if (ok) {
      onFinish?.(form.getFieldsValue());
    } else {
      onFinishFailed?.(form.getErrors());
    }
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={ref}
        className={clsx("pixel-form", className)}
        style={style}
        onSubmit={handleSubmit}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

export default Form;
