import { type CSSProperties, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./TimePicker.css";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";
import { useLocale, t } from "../LocaleProvider";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "HH:MM",
  disabled = false,
  className,
  style,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pos = usePopupPosition(inputRef, popupRef, open, "bottomLeft");

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const { messages } = useLocale();

  const select = () => {
    const str = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    onChange?.(str);
    setOpen(false);
  };

  const toggle = () => {
    if (!disabled) setOpen((v) => !v);
  };

  return (
    <div ref={ref} className={clsx("pixel-timepicker", disabled && "pixel-timepicker--disabled", className)} style={style}>
      <input
        ref={inputRef}
        className="pixel-timepicker-input"
        value={value ?? ""}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={toggle}
      />
      {open &&
        renderPopup(
          <div ref={popupRef} className="pixel-timepicker-popup" style={popupStyle(pos)}>
            <div className="pixel-timepicker-selectors">
              <div className="pixel-timepicker-col">
                {Array.from({ length: 24 }).map((_, h) => (
                  <div
                    key={h}
                    className={clsx("pixel-timepicker-opt", hour === h && "pixel-timepicker-opt--sel")}
                    onClick={() => setHour(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <div className="pixel-timepicker-col">
                {Array.from({ length: 60 }).map((_, m) => (
                  <div
                    key={m}
                    className={clsx("pixel-timepicker-opt", minute === m && "pixel-timepicker-opt--sel")}
                    onClick={() => setMinute(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="pixel-timepicker-ok" onClick={select}>
              {t("timepicker.ok", messages)}
            </button>
          </div>
        )}
    </div>
  );
}
