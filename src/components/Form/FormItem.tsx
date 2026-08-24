import {
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { FormContext } from "./types";
import type { FieldHandle, FieldValue, FormRule } from "./types";

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
  // 错误提示 id，用于 aria-describedby 关联控件与错误信息
  const errorId = name ? `pixel-form-error-${name}` : undefined;

  const control = useMemo(
    () =>
      form && name
        ? cloneControl(children, {
            name,
            value,
            error,
            errorId,
            onChange: (v: FieldValue) => {
              setValue(v);
              form.setError(name, undefined);
              form.onValuesChange?.({ [name]: v });
            },
          })
        : children,
    [form, name, children, value, error, errorId]
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
      {error && (
        <div id={errorId} className="pixel-form-error" role="alert">
          {error}
        </div>
      )}
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

/** 给子控件注入受控 value/onChange + a11y 属性，兼容原生 input 与自定义组件（Select 等） */
function cloneControl(
  children: ReactNode,
  control: {
    name?: string;
    value: FieldValue;
    error?: string;
    errorId?: string;
    onChange: (v: FieldValue) => void;
  }
): ReactNode {
  if (!isValidElement(children)) return children;
  const child = children as ReactElement<{
    defaultValue?: FieldValue;
    value?: FieldValue;
    checked?: boolean;
    type?: string;
    onChange?: (...args: unknown[]) => void;
    name?: string;
    id?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
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
    // 注入 id 使 <label htmlFor> 关联生效（消费者未显式传 id 时才注入，避免覆盖）
    ...(props.id !== undefined ? {} : { id: control.name }),
    // 校验失败时标记控件无效，并关联错误提示供屏幕阅读器播报
    "aria-invalid": control.error ? true : undefined,
    "aria-describedby": control.error ? control.errorId : undefined,
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
