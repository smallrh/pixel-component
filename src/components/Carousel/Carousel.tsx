import { useState, type ReactNode } from "react";
import clsx from "clsx";
import "./Carousel.css";

interface CarouselProps {
  items: ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

export default function Carousel({
  items,
  className,
  style,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div className={clsx("pixel-carousel", className)} style={style}>
      <div
        className="pixel-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="pixel-carousel-slide">
            {item}
          </div>
        ))}
      </div>
      <button className="pixel-carousel-btn pixel-carousel-btn--prev" onClick={prev}>
        ◀
      </button>
      <button className="pixel-carousel-btn pixel-carousel-btn--next" onClick={next}>
        ▶
      </button>
      <div className="pixel-carousel-dots">
        {items.map((_, i) => (
          <span
            key={i}
            className={clsx(
              "pixel-carousel-dot",
              i === current && "pixel-carousel-dot--active"
            )}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}