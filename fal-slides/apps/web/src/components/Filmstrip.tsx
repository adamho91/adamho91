import type { Slide } from "../types";

type Props = {
  slides: Slide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
};

export function Filmstrip({ slides, activeIndex, onSelect, onAdd, onDelete }: Props) {
  return (
    <aside className="filmstrip">
      <div className="filmstrip-header">
        <span>Slides</span>
        <button type="button" className="btn ghost" onClick={onAdd} title="Add slide">
          +
        </button>
      </div>
      <div className="filmstrip-list">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`filmstrip-item ${i === activeIndex ? "active" : ""}`}
            onClick={() => onSelect(i)}
            onContextMenu={(e) => {
              e.preventDefault();
              if (slides.length > 1 && confirm("Delete this slide?")) onDelete(i);
            }}
          >
            <div className="filmstrip-thumb" style={{ background: slide.background }}>
              <span className="filmstrip-index">{i + 1}</span>
            </div>
            <span className="filmstrip-name">{slide.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
