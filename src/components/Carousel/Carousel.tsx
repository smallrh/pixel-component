import { type CSSProperties, type KeyboardEvent, useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Carousel.css";

export interface CarouselProps {
  /** 轮播项列表（每项为 ReactNode） */
  items: ReactNode[];
  /** 是否自动轮播，默认 false */
  autoplay?: boolean;
  /** 自动轮播切换间隔（毫秒），默认 3000 */
  interval?: number;
  /** 是否显示指示点，默认 true */
  dots?: boolean;
  /** 是否显示前后翻页箭头，默认 true */
  arrows?: boolean;
  /** 附加的样式类名 */
  className?: string;
  /** 行内样式 */
  style?: CSSProperties;
}

/**
 * Carousel 轮播组件。横向滑动展示一组内容，支持自动播放、指示点、翻页箭头，
 * 鼠标悬停时自动暂停，单页时不触发自动播放。
 */
export default function Carousel({
  items,
  autoplay = false,
  interval = 3000,
  dots = true,
  arrows = true,
  className,
  style,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // 自动播放
  useEffect(() => {
    if (!autoplay || paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, paused, interval, items.length]);

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div
      className={clsx("pixel-carousel", className)}
      style={style}
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pixel-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="pixel-carousel-slide" aria-hidden={i !== current}>
            {item}
          </div>
        ))}
      </div>
      {arrows && (
        <>
          <button
            type="button"
            className="pixel-carousel-btn pixel-carousel-btn--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            ◀
          </button>
          <button
            type="button"
            className="pixel-carousel-btn pixel-carousel-btn--next"
            onClick={next}
            aria-label="Next slide"
          >
            ▶
          </button>
        </>
      )}
      {dots && (
        <div className="pixel-carousel-dots" role="tablist">
          {items.map((_, i) => (
            <button
              type="button"
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={clsx(
                "pixel-carousel-dot",
                i === current && "pixel-carousel-dot--active"
              )}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
