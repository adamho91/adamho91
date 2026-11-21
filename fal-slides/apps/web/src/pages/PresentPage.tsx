import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRemoteDeck } from "../lib/cloud";
import { loadDeckByShareId } from "../lib/storage";
import type { Deck } from "../types";
import { SlideCanvas } from "../components/SlideCanvas";

type Props = {
  byShare?: boolean;
};

export function PresentPage({ byShare = false }: Props) {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = byShare ? loadDeckByShareId(id) : await fetchRemoteDeck(id);
      if (!cancelled) setDeck(loaded);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, byShare]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!deck) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(deck.slides.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Escape") {
        if (!byShare) nav(`/edit/${deck.id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck, nav, byShare]);

  if (!deck) {
    return (
      <div className="present missing">
        <p>Deck not found.</p>
        <button type="button" className="btn" onClick={() => nav("/")}>
          Home
        </button>
      </div>
    );
  }

  const slide = deck.slides[index];

  return (
    <div className="present">
      <SlideCanvas slide={slide} selectedId={null} interactive={false} presenting />
      <div className="present-chrome">
        <span className="mono">
          {deck.title} · {index + 1}/{deck.slides.length}
        </span>
        <div className="btn-row">
          <button
            type="button"
            className="btn"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn"
            disabled={index >= deck.slides.length - 1}
            onClick={() => setIndex((i) => Math.min(deck.slides.length - 1, i + 1))}
          >
            Next
          </button>
          {!byShare ? (
            <button type="button" className="btn ghost" onClick={() => nav(`/edit/${deck.id}`)}>
              Edit
            </button>
          ) : null}
        </div>
      </div>
      {slide.notes ? (
        <aside className="presenter-notes">
          <h3>Notes</h3>
          <p>{slide.notes}</p>
        </aside>
      ) : null}
    </div>
  );
}
