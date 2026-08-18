import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import "./Splitter.css";

export interface SplitterProps {
  direction?: "horizontal" | "vertical";
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
  className?: string;
  style?: CSSProperties;
  children?: [ReactNode, ReactNode];
}

export default function Splitter({
  direction = "horizontal",
  defaultRatio = 0.5,
  minRatio = 0.2,
  maxRatio = 0.8,
  className,
  style,
  children,
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(defaultRatio);
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newRatio: number;

      if (direction === "horizontal") {
        newRatio = (e.clientX - rect.left) / rect.width;
      } else {
        newRatio = (e.clientY - rect.top) / rect.height;
      }

      newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));
      setRatio(newRatio);
    },
    [direction, minRatio, maxRatio]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!children || children.length < 2) return null;

  return (
    <div
      ref={containerRef}
      className={clsx(
        "pixel-splitter",
        `pixel-splitter--${direction}`,
        className
      )}
      style={style}
    >
      <div
        className="pixel-splitter-pane"
        style={
          direction === "horizontal"
            ? { width: `${ratio * 100}%` }
            : { height: `${ratio * 100}%` }
        }
      >
        {children[0]}
      </div>
      <div
        className={clsx(
          "pixel-splitter-handle",
          `pixel-splitter-handle--${direction}`
        )}
        onMouseDown={handleMouseDown}
      />
      <div className="pixel-splitter-pane" style={{ flex: 1 }}>
        {children[1]}
      </div>
    </div>
  );
}