import { COLORS, CHART_SERIES } from "@fal-slides/brand";
import { defaultDustSettings, getPreset, settingsFromPreset } from "@fal-slides/dust-engine";
import type { ChartObject, Deck, GlitchDustObject, Slide, SlideObject, TextObject } from "./types";
import { uid } from "./lib/id";

function text(
  partial: Partial<TextObject> & Pick<TextObject, "text" | "x" | "y" | "w" | "h">,
): TextObject {
  return {
    id: uid("txt"),
    type: "text",
    fontFamily: "focal-upright",
    fontSize: 64,
    fontWeight: 500,
    color: COLORS.black,
    align: "left",
    lineHeight: 1.1,
    ...partial,
  };
}

function chart(partial: Partial<ChartObject> & Pick<ChartObject, "x" | "y" | "w" | "h" | "title">): ChartObject {
  return {
    id: uid("cht"),
    type: "chart",
    chartType: "bar",
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [{ name: "ARR ($M)", values: [2.1, 3.4, 5.2, 7.8] }],
    ...partial,
  };
}

function dust(partial?: Partial<GlitchDustObject>): GlitchDustObject {
  const preset = getPreset("builtin-transition") ?? getPreset(listSafePreset());
  const settings = preset ? settingsFromPreset(preset) : defaultDustSettings();
  return {
    id: uid("dust"),
    type: "glitchDust",
    x: 0,
    y: 0,
    w: 1920,
    h: 1080,
    presetId: preset?.id ?? "builtin-transition",
    settings,
    progress: 0.4,
    autoplay: false,
    locked: false,
    ...partial,
  };
}

function listSafePreset(): string {
  return "builtin-transition";
}

function slide(name: string, background: string, objects: SlideObject[], notes = ""): Slide {
  return { id: uid("slide"), name, background, notes, objects };
}

export function blankDeck(mode: "sales" | "marketing" = "sales"): Deck {
  return {
    id: uid("deck"),
    title: mode === "sales" ? "Untitled sales deck" : "Untitled marketing deck",
    modeHint: mode,
    theme: { accent: COLORS.accent, background: COLORS.white },
    updatedAt: new Date().toISOString(),
    owners: ["local"],
    shareId: uid("share"),
    slides: [
      slide("Title", COLORS.black, [
        text({
          text: "fal",
          x: 120,
          y: 360,
          w: 800,
          h: 140,
          fontSize: 120,
          fontWeight: 500,
          color: COLORS.accent,
        }),
        text({
          text: "New presentation",
          x: 120,
          y: 520,
          w: 1200,
          h: 80,
          fontFamily: "focal-text",
          fontSize: 42,
          fontWeight: 400,
          color: COLORS.white,
        }),
      ]),
    ],
  };
}

export const TEMPLATES: { id: string; label: string; description: string; mode: "sales" | "marketing"; build: () => Deck }[] = [
  {
    id: "sales-pitch",
    label: "Sales pitch",
    description: "Problem → product → proof → ask",
    mode: "sales",
    build: () => ({
      id: uid("deck"),
      title: "fal sales pitch",
      modeHint: "sales",
      theme: { accent: COLORS.accent, background: COLORS.white },
      updatedAt: new Date().toISOString(),
      owners: ["local"],
      shareId: uid("share"),
      slides: [
        slide(
          "Title",
          COLORS.black,
          [
            text({ text: "fal", x: 120, y: 300, w: 600, h: 120, fontSize: 112, color: COLORS.accent }),
            text({
              text: "Inference that ships.",
              x: 120,
              y: 440,
              w: 1400,
              h: 90,
              fontFamily: "focal-text",
              fontSize: 56,
              color: COLORS.white,
            }),
            text({
              text: "Sales narrative · 16:9",
              x: 120,
              y: 920,
              w: 600,
              h: 40,
              fontFamily: "hal-mono",
              fontSize: 20,
              color: COLORS.accentLight,
            }),
          ],
          "Open with brand. Keep Focal Upright dominant.",
        ),
        slide("Problem", COLORS.white, [
          text({ text: "The problem", x: 120, y: 100, w: 800, h: 70, fontSize: 56, color: COLORS.black }),
          text({
            text: "Teams burn weeks wiring GPU infra before a single model call reaches production.",
            x: 120,
            y: 220,
            w: 1600,
            h: 160,
            fontFamily: "focal-text",
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.olive,
          }),
          {
            id: uid("shp"),
            type: "shape",
            shape: "rect",
            x: 120,
            y: 480,
            w: 520,
            h: 280,
            fill: COLORS.ltPink,
            radius: 0,
          },
          text({
            text: "Slow iteration\nFragile deploys\nOpaque cost",
            x: 160,
            y: 520,
            w: 440,
            h: 200,
            fontFamily: "focal-text",
            fontSize: 32,
            color: COLORS.red,
          }),
        ]),
        slide("Product", COLORS.sageLt, [
          text({ text: "The product", x: 120, y: 100, w: 800, h: 70, fontSize: 56 }),
          text({
            text: "Serverless GPUs. Production APIs. One platform for generative media & models.",
            x: 120,
            y: 220,
            w: 1500,
            h: 120,
            fontFamily: "focal-text",
            fontSize: 34,
            color: COLORS.green,
          }),
          chart({
            x: 120,
            y: 400,
            w: 1680,
            h: 520,
            title: "Latency vs. in-house (p50 ms)",
            chartType: "bar",
            categories: ["In-house", "fal", "Alt A", "Alt B"],
            series: [{ name: "p50 ms", values: [820, 140, 390, 510] }],
          }),
        ]),
        slide("ROI", COLORS.white, [
          text({ text: "Business case", x: 120, y: 80, w: 900, h: 70, fontSize: 56 }),
          chart({
            x: 100,
            y: 200,
            w: 1000,
            h: 700,
            title: "Projected ARR contribution ($M)",
            chartType: "area",
            categories: ["M1", "M2", "M3", "M4", "M5", "M6"],
            series: [
              { name: "Baseline", values: [1.2, 1.4, 1.5, 1.6, 1.7, 1.8] },
              { name: "With fal", values: [1.2, 1.8, 2.6, 3.5, 4.6, 6.0] },
            ],
          }),
          text({
            text: "Replace CapEx with usage.\nShip models in days.",
            x: 1180,
            y: 320,
            w: 600,
            h: 240,
            fontFamily: "focal-text",
            fontSize: 36,
            color: COLORS.blue,
          }),
        ]),
        slide("Ask", COLORS.black, [
          text({ text: "Next step", x: 120, y: 320, w: 800, h: 80, fontSize: 64, color: COLORS.accent }),
          text({
            text: "Pilot on one production workload this quarter.",
            x: 120,
            y: 440,
            w: 1500,
            h: 100,
            fontFamily: "focal-text",
            fontSize: 40,
            color: COLORS.white,
          }),
        ]),
      ],
    }),
  },
  {
    id: "sales-pricing",
    label: "Pricing overview",
    description: "Tiers and usage narrative",
    mode: "sales",
    build: () => ({
      id: uid("deck"),
      title: "fal pricing overview",
      modeHint: "sales",
      theme: { accent: COLORS.accent, background: COLORS.white },
      updatedAt: new Date().toISOString(),
      owners: ["local"],
      shareId: uid("share"),
      slides: [
        slide("Pricing", COLORS.white, [
          text({ text: "Pricing that scales", x: 120, y: 80, w: 1400, h: 80, fontSize: 64 }),
          ...(["Starter", "Growth", "Enterprise"] as const).map((label, i) => {
            const x = 120 + i * 580;
            return [
              {
                id: uid("shp"),
                type: "shape" as const,
                shape: "rect" as const,
                x,
                y: 240,
                w: 520,
                h: 620,
                fill: i === 1 ? COLORS.black : COLORS.sageLt,
                radius: 0,
              },
              text({
                text: label,
                x: x + 40,
                y: 280,
                w: 440,
                h: 60,
                fontSize: 40,
                color: i === 1 ? COLORS.accent : COLORS.black,
              }),
              text({
                text: i === 0 ? "Pay as you go\n\nIdeal for prototypes" : i === 1 ? "Committed usage\n\nBest for product teams" : "Custom limits\n\nSecurity & support",
                x: x + 40,
                y: 380,
                w: 440,
                h: 360,
                fontFamily: "focal-text",
                fontSize: 28,
                color: i === 1 ? COLORS.white : COLORS.olive,
              }),
            ];
          }).flat(),
        ]),
        slide("Usage", COLORS.ltBlue, [
          text({ text: "Usage trend", x: 120, y: 80, w: 800, h: 70, fontSize: 56 }),
          chart({
            x: 120,
            y: 200,
            w: 1680,
            h: 700,
            title: "GPU-hours / week",
            chartType: "line",
            categories: ["W1", "W2", "W3", "W4", "W5", "W6"],
            series: [{ name: "Hours", values: [120, 180, 260, 310, 420, 510] }],
          }),
        ]),
      ],
    }),
  },
  {
    id: "mkt-launch",
    label: "Product launch",
    description: "Brand moment with Glitch Dust",
    mode: "marketing",
    build: () => {
      const dustObj = dust({ locked: false, autoplay: true, progress: 0.35 });
      return {
        id: uid("deck"),
        title: "fal product launch",
        modeHint: "marketing",
        theme: { accent: COLORS.accent, background: COLORS.black },
        updatedAt: new Date().toISOString(),
        owners: ["local"],
        shareId: uid("share"),
        slides: [
          slide("Brand moment", COLORS.black, [
            dustObj,
            text({
              text: "fal",
              x: 120,
              y: 380,
              w: 700,
              h: 140,
              fontSize: 128,
              color: COLORS.accent,
            }),
            text({
              text: "Launch moment",
              x: 120,
              y: 540,
              w: 900,
              h: 70,
              fontFamily: "focal-text",
              fontSize: 42,
              color: COLORS.white,
            }),
          ], "Dust layer is live — scrub in Marketing mode."),
          slide("Campaign", COLORS.white, [
            text({ text: "Campaign system", x: 120, y: 120, w: 1400, h: 80, fontSize: 64 }),
            text({
              text: "Same Focal faces. Same tonal palettes. Dust presets travel from the maker into the deck.",
              x: 120,
              y: 260,
              w: 1600,
              h: 160,
              fontFamily: "focal-text",
              fontSize: 36,
              color: COLORS.olive,
            }),
            {
              id: uid("logo"),
              type: "logo",
              variant: "brand",
              x: 120,
              y: 860,
              w: 180,
              h: 64,
            },
          ]),
          slide("Social recap", COLORS.black, [
            dust({
              x: 960,
              y: 0,
              w: 960,
              h: 1080,
              progress: 0.55,
            }),
            text({
              text: "Social\nrecap",
              x: 120,
              y: 280,
              w: 700,
              h: 320,
              fontSize: 96,
              color: COLORS.white,
            }),
            chart({
              x: 120,
              y: 680,
              w: 720,
              h: 300,
              title: "Reach (K)",
              chartType: "pie",
              categories: ["X", "LI", "IG", "YT"],
              series: [{ name: "Reach", values: [42, 28, 18, 12] }],
            }),
          ]),
        ],
      };
    },
  },
  {
    id: "mkt-brand",
    label: "Brand moment",
    description: "Full-bleed dust + Focal headline",
    mode: "marketing",
    build: () => ({
      id: uid("deck"),
      title: "fal brand moment",
      modeHint: "marketing",
      theme: { accent: COLORS.accent, background: COLORS.black },
      updatedAt: new Date().toISOString(),
      owners: ["local"],
      shareId: uid("share"),
      slides: [
        slide("Dust", COLORS.black, [
          dust({ progress: 0.42, autoplay: true }),
          text({
            text: "Make something\nimpossible.",
            x: 140,
            y: 340,
            w: 1400,
            h: 280,
            fontSize: 96,
            color: COLORS.white,
          }),
        ]),
      ],
    }),
  },
];

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}

export { CHART_SERIES };
