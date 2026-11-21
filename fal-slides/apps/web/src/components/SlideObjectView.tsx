import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { FONT_FAMILIES } from "@fal-slides/brand";
import type { SlideObject } from "../types";
import { ChartView } from "./ChartView";
import { GlitchDustCanvas } from "./GlitchDustCanvas";
import brandLogo from "@brand/logos/app-brand.svg";
import lightLogo from "@brand/logos/logo/light.svg";
import darkLogo from "@brand/logos/logo/dark.svg";

const logoSrc = {
  brand: brandLogo,
  light: lightLogo,
  dark: darkLogo,
} as const;

function fontCss(id: string): string {
  return FONT_FAMILIES.find((f) => f.id === id)?.css ?? FONT_FAMILIES[0].css;
}

type Props = {
  object: SlideObject;
  selected?: boolean;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  onChange?: (id: string, patch: Partial<SlideObject>) => void;
  presenting?: boolean;
};

export function SlideObjectView({
  object,
  selected,
  interactive,
  onSelect,
  onChange,
  presenting,
}: Props) {
  const style: CSSProperties = {
    position: "absolute",
    left: object.x,
    top: object.y,
    width: object.w,
    height: object.h,
    boxSizing: "border-box",
    outline: selected && !presenting ? "2px solid #ADFF00" : "none",
    outlineOffset: 2,
    cursor: interactive && !object.locked ? "move" : "default",
    userSelect: presenting ? "none" : "auto",
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!interactive || object.locked) return;
    e.stopPropagation();
    onSelect?.(object.id);
    if (presenting) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = object.x;
    const origY = object.y;
    const parent = (e.currentTarget.parentElement as HTMLElement) || null;
    const scale = parent ? parent.getBoundingClientRect().width / 1920 : 1;

    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      onChange?.(object.id, { x: Math.round(origX + dx), y: Math.round(origY + dy) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  if (object.type === "text") {
    return (
      <div
        style={{
          ...style,
          fontFamily: fontCss(object.fontFamily),
          fontSize: object.fontSize,
          fontWeight: object.fontWeight,
          color: object.color,
          textAlign: object.align,
          lineHeight: object.lineHeight,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}
        onPointerDown={onPointerDown}
        contentEditable={interactive && selected && !object.locked && !presenting}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (!interactive) return;
          onChange?.(object.id, { text: e.currentTarget.innerText });
        }}
      >
        {object.text}
      </div>
    );
  }

  if (object.type === "shape") {
    return (
      <div
        onPointerDown={onPointerDown}
        style={{
          ...style,
          background: object.fill,
          borderRadius: object.shape === "ellipse" ? "50%" : object.radius ?? 0,
          border: object.stroke ? `${object.strokeWidth ?? 2}px solid ${object.stroke}` : undefined,
        }}
      />
    );
  }

  if (object.type === "image") {
    return (
      <div onPointerDown={onPointerDown} style={{ ...style, overflow: "hidden" }}>
        <img
          src={object.src}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: object.fit, display: "block" }}
        />
      </div>
    );
  }

  if (object.type === "logo") {
    return (
      <div onPointerDown={onPointerDown} style={style}>
        <img
          src={logoSrc[object.variant]}
          alt="fal"
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  if (object.type === "chart") {
    return (
      <div
        onPointerDown={onPointerDown}
        style={{ ...style, background: "rgba(255,255,255,0.92)", overflow: "hidden" }}
      >
        <ChartView object={object} />
      </div>
    );
  }

  if (object.type === "glitchDust") {
    return (
      <div onPointerDown={onPointerDown} style={{ ...style, overflow: "hidden" }}>
        <GlitchDustCanvas
          settings={object.settings}
          progress={object.progress}
          autoplay={presenting ? object.autoplay : false}
          width={1920}
          height={1080}
        />
      </div>
    );
  }

  return null;
}
