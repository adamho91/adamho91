export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_RATIO = 16 / 9;

export const ACCENT = "#ADFF00";

export const COLORS = {
  accent: "#ADFF00",
  accentLight: "#C8FF66",
  accentPale: "#E4FF99",
  accentDark: "#7A9900",
  accentDeep: "#3D5A00",
  blue: "#115EF3",
  cyan: "#99EDFF",
  sky: "#3FB5FE",
  ltBlue: "#C5E9FF",
  green: "#004012",
  olive: "#403700",
  yellow: "#FFFF00",
  red: "#EC0648",
  pink: "#F57EC3",
  ltPink: "#FFC4D8",
  sage: "#96AFAC",
  sageLt: "#E5ECE7",
  brownLt: "#D9D7CC",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const FAL_BRAND_PALETTE = [
  { id: "purple", label: "Purple", colors: ["#5718C0", "#AB77FF", "#D5BBFF"] },
  { id: "blue", label: "Blue", colors: ["#115EF3", "#3FB5FE", "#C5E9FF"] },
  { id: "teal", label: "Teal / Sage", colors: ["#99EDFF", "#96AFAC", "#E5ECE7"] },
  { id: "green", label: "Green / Lime", colors: ["#004012", "#ADFF00", "#F1FFD2", "#C8FF66"] },
  { id: "earth", label: "Earth / Yellow", colors: ["#403700", "#FFFF00", "#D9D7CC"] },
  { id: "red", label: "Red / Pink", colors: ["#EC0648", "#F57EC3", "#FFC4D8"] },
  { id: "neutral", label: "Neutral", colors: ["#000000", "#FFFFFF"] },
] as const;

export const CHART_SERIES = [
  COLORS.accent,
  COLORS.blue,
  COLORS.cyan,
  COLORS.red,
  COLORS.pink,
  COLORS.yellow,
  COLORS.olive,
  COLORS.sky,
] as const;

export const FONT_FAMILIES = [
  { id: "focal-upright", label: "Focal Upright", css: '"Focal Upright", sans-serif', role: "display" },
  { id: "focal-text", label: "Focal Text", css: '"Focal Text", sans-serif', role: "body" },
  { id: "hal-mono", label: "HAL Timezone Mono", css: '"HAL Timezone Mono", ui-monospace, monospace', role: "mono" },
] as const;

export const FONT_WEIGHTS = [
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extrabold" },
  { value: 900, label: "Black" },
] as const;

export type FontFamilyId = (typeof FONT_FAMILIES)[number]["id"];
