import type { DustSettings } from "@fal-slides/dust-engine";
import type { FontFamilyId } from "@fal-slides/brand";

export type AppMode = "sales" | "marketing";

export type TextObject = {
  id: string;
  type: "text";
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontFamily: FontFamilyId;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: "left" | "center" | "right";
  lineHeight: number;
  locked?: boolean;
};

export type ShapeObject = {
  id: string;
  type: "shape";
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "rect" | "ellipse";
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  locked?: boolean;
};

export type ImageObject = {
  id: string;
  type: "image";
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  fit: "cover" | "contain";
  locked?: boolean;
};

export type LogoObject = {
  id: string;
  type: "logo";
  x: number;
  y: number;
  w: number;
  h: number;
  variant: "brand" | "light" | "dark";
  locked?: boolean;
};

export type ChartSeries = {
  name: string;
  values: number[];
};

export type ChartObject = {
  id: string;
  type: "chart";
  x: number;
  y: number;
  w: number;
  h: number;
  chartType: "bar" | "line" | "area" | "pie";
  title: string;
  categories: string[];
  series: ChartSeries[];
  locked?: boolean;
};

export type GlitchDustObject = {
  id: string;
  type: "glitchDust";
  x: number;
  y: number;
  w: number;
  h: number;
  presetId: string;
  settings: DustSettings;
  progress: number;
  autoplay: boolean;
  locked?: boolean;
};

export type SlideObject =
  | TextObject
  | ShapeObject
  | ImageObject
  | LogoObject
  | ChartObject
  | GlitchDustObject;

export type Slide = {
  id: string;
  name: string;
  background: string;
  notes: string;
  objects: SlideObject[];
};

export type Deck = {
  id: string;
  title: string;
  modeHint: AppMode;
  theme: {
    accent: string;
    background: string;
  };
  slides: Slide[];
  updatedAt: string;
  owners: string[];
  shareId?: string;
};

export type DeckSummary = {
  id: string;
  title: string;
  modeHint: AppMode;
  updatedAt: string;
  slideCount: number;
  shareId?: string;
};
