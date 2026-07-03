import { useState, type ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Tour.css";

interface TourStep {
  title?: string;
  description: ReactNode;
  target?: string; // CSS selector
}

interface TourProps {
  steps: TourStep[];
  open?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Tour({
  steps,
  open = false,
  onClose,
  className,
  style,
}: TourProps) {
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
            {isLast ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}