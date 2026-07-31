import { COLORS } from "@fal-slides/brand";
import { defaultDustSettings, listPresets, settingsFromPreset } from "@fal-slides/dust-engine";
import type { AppMode, ChartObject, SlideObject } from "../types";
import { uid } from "../lib/id";

type Props = {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onInsert: (object: SlideObject) => void;
  onPresent: () => void;
  onExportPng: () => void;
  onHome: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  dirty: boolean;
};

export function Toolbar({
  mode,
  onModeChange,
  onInsert,
  onPresent,
  onExportPng,
  onHome,
  title,
  onTitleChange,
  dirty,
}: Props) {
  const insertText = () =>
    onInsert({
      id: uid("txt"),
      type: "text",
      x: 200,
      y: 200,
      w: 800,
      h: 120,
      text: "New text",
      fontFamily: "focal-upright",
      fontSize: 64,
      fontWeight: 500,
      color: COLORS.black,
      align: "left",
      lineHeight: 1.1,
    });

  const insertShape = () =>
    onInsert({
      id: uid("shp"),
      type: "shape",
      x: 240,
      y: 240,
      w: 400,
      h: 240,
      shape: "rect",
      fill: COLORS.accent,
    });

  const insertChart = () =>
    onInsert({
      id: uid("cht"),
      type: "chart",
      x: 200,
      y: 200,
      w: 1000,
      h: 560,
      chartType: "bar",
      title: "Metric",
      categories: ["A", "B", "C", "D"],
      series: [{ name: "Series", values: [4, 7, 5, 9] }],
    } satisfies ChartObject);

  const insertLogo = () =>
    onInsert({
      id: uid("logo"),
      type: "logo",
      x: 80,
      y: 80,
      w: 160,
      h: 56,
      variant: "brand",
    });

  const insertDust = () => {
    const preset = listPresets()[0];
    const settings = preset ? settingsFromPreset(preset) : defaultDustSettings();
    onInsert({
      id: uid("dust"),
      type: "glitchDust",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      presetId: preset?.id ?? "builtin-transition",
      settings,
      progress: 0.4,
      autoplay: true,
    });
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        onInsert({
          id: uid("img"),
          type: "image",
          x: 200,
          y: 160,
          w: 800,
          h: 500,
          src: String(reader.result),
          fit: "cover",
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <button type="button" className="btn ghost" onClick={onHome}>
          fal Slides
        </button>
        <input
          className="title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          aria-label="Deck title"
        />
        <span className="save-pill">{dirty ? "Saving…" : "Saved"}</span>
      </div>
      <div className="toolbar-center">
        <button type="button" className="btn" onClick={insertText}>
          Text
        </button>
        <button type="button" className="btn" onClick={insertShape}>
          Shape
        </button>
        <button type="button" className="btn" onClick={insertImage}>
          Image
        </button>
        <button type="button" className="btn" onClick={insertChart}>
          Chart
        </button>
        <button type="button" className="btn" onClick={insertLogo}>
          Logo
        </button>
        <button
          type="button"
          className="btn accent"
          onClick={insertDust}
          disabled={mode === "sales"}
          title={mode === "sales" ? "Switch to Marketing mode to insert Glitch Dust" : "Insert Glitch Dust"}
        >
          Glitch Dust
        </button>
      </div>
      <div className="toolbar-right">
        <div className="mode-toggle" role="group" aria-label="Editor mode">
          <button
            type="button"
            className={mode === "sales" ? "active" : ""}
            onClick={() => onModeChange("sales")}
          >
            Sales
          </button>
          <button
            type="button"
            className={mode === "marketing" ? "active" : ""}
            onClick={() => onModeChange("marketing")}
          >
            Marketing
          </button>
        </div>
        <button type="button" className="btn" onClick={onExportPng}>
          PNG
        </button>
        <button type="button" className="btn primary" onClick={onPresent}>
          Present
        </button>
      </div>
    </header>
  );
}
