import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { useLocale, t } from "../LocaleProvider";

/* ===== 类型 ===== */

export interface FormRule {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => string | undefined | Promise<string | undefined>;
}

type FieldValue = unknown;

interface FieldHandle {
  name: string;
  rules?: FormRule[];
  getValue: () => FieldValue;
  setValue: (v: FieldValue) => void;
}

interface FormContextValue {
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

const FormContext = createContext<FormContextValue | null>(null);

/* ===== useForm 实例 ===== */

export interface FormInstance {
  validate: () => Promise<boolean>;
  setFieldValue: (name: string, value: FieldValue) => void;
  setFieldsValue: (values: Record<string, FieldValue>) => void;
  getFieldsValue: () => Record<string, FieldValue>;
  getFieldValue: (name: string) => FieldValue;
  resetFields: () => void;
  getErrors: () => Record<string, string>;
  setError: (name: string, message?: string) => void;
  registerField: (h: FieldHandle) => void;
  unregisterField: (name: string) => void;
  /** @internal 由 Form 渲染时注入 locale 消息（用于内置校验文案） */
  _setMessages: (messages: Record<string, string>) => void;
}

export function useForm(): FormInstance {
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

  const setFieldValue = useCallback((name: string, value: FieldValue) => {
    fieldsRef.current.get(name)?.setValue(value);
  }, []);

  const setFieldsValue = useCallback((values: Record<string, FieldValue>) => {
    for (const [name, value] of Object.entries(values)) {
      fieldsRef.current.get(name)?.setValue(value);
    }
  }, []);

  const getFieldValue = useCallback(
    (name: string) => fieldsRef.current.get(name)?.getValue(),
    []
  );

  const getFieldsValue = useCallback(
    () =>
      Object.fromEntries(
        [...fieldsRef.current.entries()].map(([name, h]) => [name, h.getValue()])
      ),
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

/* ===== 校验逻辑 ===== */

async function runRules(
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
      return rule.message ?? `Minimum value is ${rule.min}`;
    }
    if (!isEmpty && rule.max !== undefined && typeof value === "number" && value > rule.max) {
      return rule.message ?? `Maximum value is ${rule.max}`;
    }
    if (!isEmpty && rule.min !== undefined && typeof value === "string" && value.length < rule.min) {
      return rule.message ?? `Minimum length is ${rule.min}`;
    }
    if (!isEmpty && rule.max !== undefined && typeof value === "string" && value.length > rule.max) {
      return rule.message ?? `Maximum length is ${rule.max}`;
    }
    if (!isEmpty && rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message ?? "Invalid format";
    }
    if (rule.validator) {
      const result = await rule.validator(value);
      if (result) return result;
    }
  }
  return undefined;
}

/* ===== FormItem ===== */

interface FormItemProps {
  label?: string;
  name?: string;
  children: ReactNode;
  rules?: FormRule[];
  className?: string;
  style?: CSSProperties;
}

export function FormItem({
  label,
  name,
  children,
  rules,
  className,
  style,
}: FormItemProps) {
  const form = useContext(FormContext);
  // 初始化优先级：Form.initialValues[name] > 子控件 defaultValue/value > ""
  const [value, setValue] = useState<FieldValue>(() =>
    name && form?.initialValues?.[name] !== undefined
      ? form.initialValues[name]
      : getInitialValue(children)
  );
  const valueRef = useRef(value);
  const handleRef = useRef<FieldHandle | null>(null);

  // 每次渲染后同步最新值到 ref（getValue 在事件处理器中读取）
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // 注册字段（name 变化时重注册）
  useEffect(() => {
    if (!form || !name) return;
    const handle: FieldHandle = {
      name,
      rules,
      getValue: () => valueRef.current,
      setValue: (v) => {
        valueRef.current = v;
        setValue(v);
      },
    };
    handleRef.current = handle;
    form.registerField(handle);
    return () => {
      form.unregisterField(name);
      handleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name]);

  // rules 引用变化时同步到已注册的 handle
  useEffect(() => {
    if (handleRef.current) handleRef.current.rules = rules;
  }, [rules]);

  const error = name ? form?.errors[name] : undefined;

  const control = useMemo(
    () =>
      form && name
        ? cloneControl(children, {
            name,
            value,
            onChange: (v: FieldValue) => {
              setValue(v);
              form.setError(name, undefined);
              form.onValuesChange?.({ [name]: v });
            },
          })
        : children,
    [form, name, children, value]
  );

  return (
    <div
      className={clsx("pixel-form-item", error && "pixel-form-item--error", className)}
      style={style}
    >
      {label && (
        <label className="pixel-form-label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="pixel-form-control">{control}</div>
      {error && <div className="pixel-form-error">{error}</div>}
    </div>
  );
}

function getInitialValue(children: ReactNode): FieldValue {
  if (isValidElement(children)) {
    const props = (children as ReactElement<{ defaultValue?: FieldValue; value?: FieldValue }>).props;
    return props?.defaultValue ?? props?.value ?? "";
  }
  return "";
}

/** 给子控件注入受控 value/onChange，兼容原生 input 与自定义组件（Select 等） */
function cloneControl(
  children: ReactNode,
  control: { name?: string; value: FieldValue; onChange: (v: FieldValue) => void }
): ReactNode {
  if (!isValidElement(children)) return children;
  const child = children as ReactElement<{
    defaultValue?: FieldValue;
    value?: FieldValue;
    checked?: boolean;
    type?: string;
    onChange?: (...args: unknown[]) => void;
    name?: string;
  }>;
  const props = child.props ?? {};
  // 原生 checkbox/radio 通过 props.type 识别；自定义可勾选组件（Checkbox 等）
  // 通过静态标记 __PIXEL_CHECKABLE__ 识别，否则会注入 value 而非 checked，
  // 导致组件不消费 value、选中 UI 与表单值脱节。
  const isCheckable =
    props.type === "checkbox" ||
    props.type === "radio" ||
    Boolean((child.type as { __PIXEL_CHECKABLE__?: boolean } | null)?.__PIXEL_CHECKABLE__);

  return cloneElement(child, {
    name: control.name,
    // 保留 defaultValue 语义，否则注入受控 value
    ...(props.defaultValue !== undefined ? {} : { value: control.value }),
    // 复选框/单选框注入 checked
    ...(isCheckable ? { checked: Boolean(control.value) } : {}),
    onChange: (...args: unknown[]) => {
      props.onChange?.(...args);
      const first = args[0];
      const isEvent =
        first && typeof first === "object" && "target" in (first as object);
      if (isCheckable) {
        // 原生 input 回调参数为 event；自定义 Checkbox 回调参数为布尔值
        if (isEvent) {
          control.onChange((first as { target?: { checked?: boolean } }).target?.checked ?? false);
        } else {
          control.onChange(first);
        }
      } else if (isEvent) {
        control.onChange((first as { target?: { value?: FieldValue } }).target?.value);
      } else {
        control.onChange(first);
      }
    },
  });
}

/* ===== Form ===== */

export interface FormProps {
  children: ReactNode;
  form?: FormInstance;
  /** 表单初始值（优先级高于子控件 defaultValue/value） */
  initialValues?: Record<string, unknown>;
  onFinish?: (values: Record<string, FieldValue>) => void;
  onFinishFailed?: (errors: Record<string, string>) => void;
  /** 任意字段值变化时触发（values 为全量当前值，changedValues 为本次变更） */
  onValuesChange?: (values: Record<string, unknown>, changedValues: Record<string, unknown>) => void;
  className?: string;
  style?: CSSProperties;
}

export default function Form({
  children,
  form: formProp,
  initialValues,
  onFinish,
  onFinishFailed,
  onValuesChange,
  className,
  style,
}: FormProps) {
  const internal = useForm();
  const form = formProp ?? internal;
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
      onValuesChangeRef.current?.(next, changed);
      return next;
    });
  }, []);

  const contextValue = useMemo<FormContextValue>(
    () => ({
      registerField: form.registerField,
      unregisterField: form.unregisterField,
      errors,
      setError: (name, message) => form.setError(name, message),
      setFieldValue: (name, v) => form.setFieldValue(name, v),
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
