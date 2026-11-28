import { useEffect, useRef, useState } from "react";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@fal-slides/brand";
import type { Slide, SlideObject } from "../types";
import { SlideObjectView } from "./SlideObjectView";

type Props = {
  slide: Slide;
  selectedId: string | null;
  interactive?: boolean;
  presenting?: boolean;
  onSelect?: (id: string | null) => void;
  onChangeObject?: (id: string, patch: Partial<SlideObject>) => void;
};

export function SlideCanvas({
  slide,
  selectedId,
  interactive = true,
  presenting = false,
  onSelect,
  onChangeObject,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT);
      setScale(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="slide-canvas-wrap"
      onPointerDown={() => interactive && onSelect?.(null)}
    >
      <div
        className="slide-canvas-stage"
        style={{
          width: SLIDE_WIDTH * scale,
          height: SLIDE_HEIGHT * scale,
        }}
      >
        <div
          className="slide-artboard"
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: slide.background,
          }}
        >
          {slide.objects.map((obj) => (
            <SlideObjectView
              key={obj.id}
              object={obj}
              selected={selectedId === obj.id}
              interactive={interactive}
              presenting={presenting}
              onSelect={onSelect}
              onChange={onChangeObject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
