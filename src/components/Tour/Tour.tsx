import { type CSSProperties, useState, type ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Tour.css";
import { useLocale, t } from "../LocaleProvider";

interface TourStep {
  /** 当前步骤标题 */
  title?: string;
  /** 当前步骤描述 */
  description: ReactNode;
  /** 目标元素的 CSS 选择器 */
  target?: string; // CSS selector
}

export interface TourProps {
  /** 引导步骤列表 */
  steps: TourStep[];
  /** 是否展示，非受控默认 false */
  open?: boolean;
  /** 关闭/跳过回调 */
  onClose?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Tour。分步引导浮层，按 steps 顺序展示步骤并支持上一步/下一步/跳过，结束后回调 onClose。
 */
export default function Tour({
  steps,
  open = false,
  onClose,
  className,
  style,
}: TourProps) {
  const { messages } = useLocale();
  const [step, setStep] = useState(0);

  if (!open || steps.length === 0) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="pixel-tour-overlay">
      <div className={clsx("pixel-tour-card", className)} style={style}>
        <div className="pixel-tour-step">
          Step {step + 1} of {steps.length}
        </div>
        {current.title && (
          <div className="pixel-tour-title">{current.title}</div>
        )}
        <div className="pixel-tour-desc">{current.description}</div>
        <div className="pixel-tour-actions">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Skip
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (isLast) {
                onClose?.();
              } else {
                setStep((s) => s + 1);
              }
            }}
          >
            {isLast ? t("tour.done", messages) : t("tour.next", messages)}
          </Button>
        </div>
      </div>
    </div>
  );
}