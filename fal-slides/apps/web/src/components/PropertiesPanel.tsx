import { FONT_FAMILIES, FONT_WEIGHTS, COLORS, FAL_BRAND_PALETTE } from "@fal-slides/brand";
import { listPresets, settingsFromPreset } from "@fal-slides/dust-engine";
import type { AppMode, ChartObject, GlitchDustObject, Slide, SlideObject } from "../types";

type Props = {
  mode: AppMode;
  slide: Slide;
  selected: SlideObject | null;
  onUpdateSlide: (patch: Partial<Slide>) => void;
  onUpdateObject: (id: string, patch: Partial<SlideObject>) => void;
  onDeleteObject: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
};

export function PropertiesPanel({
  mode,
  slide,
  selected,
  onUpdateSlide,
  onUpdateObject,
  onDeleteObject,
  onReorder,
}: Props) {
  return (
    <aside className="properties">
      <div className="properties-section">
        <h3>Slide</h3>
        <label className="field">
          <span>Name</span>
          <input
            value={slide.name}
            onChange={(e) => onUpdateSlide({ name: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Background</span>
          <input
            type="color"
            value={normalizeHex(slide.background)}
            onChange={(e) => onUpdateSlide({ background: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Speaker notes</span>
          <textarea
            rows={4}
            value={slide.notes}
            onChange={(e) => onUpdateSlide({ notes: e.target.value })}
          />
        </label>
      </div>

      {!selected ? (
        <div className="properties-section muted">
          <p>Select an object to edit properties.</p>
          {mode === "sales" ? (
            <p className="hint">Sales mode keeps layouts on-brand. Switch to Marketing for Glitch Dust & freer layers.</p>
          ) : (
            <p className="hint">Marketing mode unlocks Glitch Dust inserts and freer positioning.</p>
          )}
        </div>
      ) : (
        <div className="properties-section">
          <div className="properties-row">
            <h3>{selected.type}</h3>
            <div className="btn-row">
              <button type="button" className="btn ghost" onClick={() => onReorder(selected.id, "down")}>
                ↓
              </button>
              <button type="button" className="btn ghost" onClick={() => onReorder(selected.id, "up")}>
                ↑
              </button>
              <button type="button" className="btn danger" onClick={() => onDeleteObject(selected.id)}>
                Delete
              </button>
            </div>
          </div>

          <div className="field-grid">
            {(["x", "y", "w", "h"] as const).map((key) => (
              <label key={key} className="field compact">
                <span>{key.toUpperCase()}</span>
                <input
                  type="number"
                  value={selected[key]}
                  disabled={mode === "sales" && selected.locked}
                  onChange={(e) =>
                    onUpdateObject(selected.id, { [key]: Number(e.target.value) } as Partial<SlideObject>)
                  }
                />
              </label>
            ))}
          </div>

          {selected.type === "text" && (
            <>
              <label className="field">
                <span>Font</span>
                <select
                  value={selected.fontFamily}
                  onChange={(e) =>
                    onUpdateObject(selected.id, {
                      fontFamily: e.target.value as typeof selected.fontFamily,
                    })
                  }
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Weight</span>
                <select
                  value={selected.fontWeight}
                  onChange={(e) =>
                    onUpdateObject(selected.id, { fontWeight: Number(e.target.value) })
                  }
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Size</span>
                <input
                  type="number"
                  value={selected.fontSize}
                  onChange={(e) =>
                    onUpdateObject(selected.id, { fontSize: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                <span>Color</span>
                <input
                  type="color"
                  value={normalizeHex(selected.color)}
                  onChange={(e) => onUpdateObject(selected.id, { color: e.target.value })}
                />
              </label>
              <div className="swatch-row">
                {FAL_BRAND_PALETTE.flatMap((g) => g.colors).slice(0, 14).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="swatch"
                    style={{ background: c }}
                    title={c}
                    onClick={() => onUpdateObject(selected.id, { color: c })}
                  />
                ))}
              </div>
              <label className="field">
                <span>Align</span>
                <select
                  value={selected.align}
                  onChange={(e) =>
                    onUpdateObject(selected.id, {
                      align: e.target.value as typeof selected.align,
                    })
                  }
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>
            </>
          )}

          {selected.type === "shape" && (
            <>
              <label className="field">
                <span>Shape</span>
                <select
                  value={selected.shape}
                  onChange={(e) =>
                    onUpdateObject(selected.id, {
                      shape: e.target.value as typeof selected.shape,
                    })
                  }
                >
                  <option value="rect">Rectangle</option>
                  <option value="ellipse">Ellipse</option>
                </select>
              </label>
              <label className="field">
                <span>Fill</span>
                <input
                  type="color"
                  value={normalizeHex(selected.fill)}
                  onChange={(e) => onUpdateObject(selected.id, { fill: e.target.value })}
                />
              </label>
            </>
          )}

          {selected.type === "logo" && (
            <label className="field">
              <span>Variant</span>
              <select
                value={selected.variant}
                onChange={(e) =>
                  onUpdateObject(selected.id, {
                    variant: e.target.value as typeof selected.variant,
                  })
                }
              >
                <option value="brand">Brand</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          )}

          {selected.type === "chart" && <ChartProps object={selected} onUpdate={onUpdateObject} />}

          {selected.type === "glitchDust" && (
            <DustProps object={selected} onUpdate={onUpdateObject} locked={mode === "sales" && !!selected.locked} />
          )}
        </div>
      )}
    </aside>
  );
}

function ChartProps({
  object,
  onUpdate,
}: {
  object: ChartObject;
  onUpdate: (id: string, patch: Partial<SlideObject>) => void;
}) {
  const series = object.series[0];
  return (
    <>
      <label className="field">
        <span>Title</span>
        <input
          value={object.title}
          onChange={(e) => onUpdate(object.id, { title: e.target.value })}
        />
      </label>
      <label className="field">
        <span>Type</span>
        <select
          value={object.chartType}
          onChange={(e) =>
            onUpdate(object.id, { chartType: e.target.value as ChartObject["chartType"] })
          }
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="area">Area</option>
          <option value="pie">Pie</option>
        </select>
      </label>
      <label className="field">
        <span>Categories (CSV)</span>
        <input
          value={object.categories.join(", ")}
          onChange={(e) =>
            onUpdate(object.id, {
              categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </label>
      {series ? (
        <label className="field">
          <span>{series.name} values (CSV)</span>
          <input
            value={series.values.join(", ")}
            onChange={(e) => {
              const values = e.target.value
                .split(",")
                .map((s) => Number(s.trim()))
                .filter((n) => Number.isFinite(n));
              onUpdate(object.id, {
                series: [{ ...series, values }],
              });
            }}
          />
        </label>
      ) : null}
      <p className="hint">Paste CSV numbers to overwrite series. Colors use fal chart palette ({COLORS.accent}).</p>
    </>
  );
}

function DustProps({
  object,
  onUpdate,
  locked,
}: {
  object: GlitchDustObject;
  onUpdate: (id: string, patch: Partial<SlideObject>) => void;
  locked?: boolean;
}) {
  const presets = listPresets();
  return (
    <>
      <label className="field">
        <span>Preset</span>
        <select
          disabled={locked}
          value={object.presetId}
          onChange={(e) => {
            const preset = presets.find((p) => p.id === e.target.value);
            if (!preset) return;
            onUpdate(object.id, {
              presetId: preset.id,
              settings: settingsFromPreset(preset),
            });
          }}
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Scrub {Math.round(object.progress * 100)}%</span>
        <input
          type="range"
          min={0}
          max={100}
          disabled={locked}
          value={Math.round(object.progress * 100)}
          onChange={(e) =>
            onUpdate(object.id, { progress: Number(e.target.value) / 100 })
          }
        />
      </label>
      <label className="field check">
        <input
          type="checkbox"
          checked={object.autoplay}
          disabled={locked}
          onChange={(e) => onUpdate(object.id, { autoplay: e.target.checked })}
        />
        <span>Autoplay in present</span>
      </label>
      <label className="field">
        <span>Background</span>
        <input
          type="color"
          disabled={locked}
          value={normalizeHex(object.settings.bg)}
          onChange={(e) =>
            onUpdate(object.id, {
              settings: { ...object.settings, bg: e.target.value },
            })
          }
        />
      </label>
      <label className="field">
        <span>Particle size</span>
        <input
          type="range"
          min={16}
          max={120}
          disabled={locked}
          value={object.settings.sliders.pixSize}
          onChange={(e) =>
            onUpdate(object.id, {
              settings: {
                ...object.settings,
                sliders: {
                  ...object.settings.sliders,
                  pixSize: Number(e.target.value),
                },
              },
            })
          }
        />
      </label>
      <label className="field">
        <span>Amount</span>
        <input
          type="range"
          min={40}
          max={400}
          disabled={locked}
          value={object.settings.sliders.pixAmt}
          onChange={(e) =>
            onUpdate(object.id, {
              settings: {
                ...object.settings,
                sliders: {
                  ...object.settings.sliders,
                  pixAmt: Number(e.target.value),
                },
              },
            })
          }
        />
      </label>
      <div className="swatch-row">
        {object.settings.colors.map((c) => (
          <span key={c} className="swatch" style={{ background: c }} title={c} />
        ))}
      </div>
      <p className="hint">Presets imported from fal glitch dust maker · 1920×1080</p>
    </>
  );
}

function normalizeHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}
