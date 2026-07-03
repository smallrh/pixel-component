import clsx from "clsx";
import "./Steps.css";

interface StepItem {
  title: string;
  description?: string;
}

interface StepsProps {
  current: number;
  items: StepItem[];
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

export default function Steps({
  current,
  items,
  direction = "horizontal",
  className,
  style,
}: StepsProps) {
  return (
    <div
      className={clsx("pixel-steps", `pixel-steps--${direction}`, className)}
      style={style}
    >
      {items.map((item, index) => {
        const status =
          index < current
            ? "completed"
            : index === current
              ? "active"
              : "pending";

        return (
          <div
            key={index}
            className={clsx("pixel-step", `pixel-step--${status}`)}
          >
            <div className="pixel-step-indicator-wrapper">
              <div className="pixel-step-indicator">
                {status === "completed" ? (
                  <span className="pixel-step-icon">✓</span>
                ) : (
                  <span className="pixel-step-number">{index + 1}</span>
                )}
              </div>
              {index < items.length - 1 && (
                <div
                  className={clsx(
                    "pixel-step-line",
                    `pixel-step-line--${direction}`,
                    status === "completed" && "pixel-step-line--completed"
                  )}
                />
              )}
            </div>
            <div className="pixel-step-content">
              <div className="pixel-step-title">{item.title}</div>
              {item.description && (
                <div className="pixel-step-description">{item.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}