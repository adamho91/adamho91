import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { AppMode, Deck, Slide, SlideObject } from "../types";
import { clone, uid } from "./id";
import { persistDeck } from "./cloud";

type State = {
  deck: Deck;
  slideIndex: number;
  selectedId: string | null;
  mode: AppMode;
  dirty: boolean;
};

type Action =
  | { type: "replace"; deck: Deck; mode?: AppMode }
  | { type: "setMode"; mode: AppMode }
  | { type: "selectSlide"; index: number }
  | { type: "selectObject"; id: string | null }
  | { type: "updateDeck"; patch: Partial<Deck> }
  | { type: "updateSlide"; patch: Partial<Slide> }
  | { type: "addSlide"; slide?: Slide }
  | { type: "deleteSlide"; index: number }
  | { type: "addObject"; object: SlideObject }
  | { type: "updateObject"; id: string; patch: Partial<SlideObject> }
  | { type: "deleteObject"; id: string }
  | { type: "reorderObject"; id: string; direction: "up" | "down" }
  | { type: "markClean" };

function currentSlide(state: State): Slide {
  return state.deck.slides[state.slideIndex] ?? state.deck.slides[0];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "replace":
      return {
        deck: action.deck,
        slideIndex: 0,
        selectedId: null,
        mode: action.mode ?? action.deck.modeHint,
        dirty: false,
      };
    case "setMode":
      return { ...state, mode: action.mode, dirty: true };
    case "selectSlide":
      return {
        ...state,
        slideIndex: Math.max(0, Math.min(action.index, state.deck.slides.length - 1)),
        selectedId: null,
      };
    case "selectObject":
      return { ...state, selectedId: action.id };
    case "updateDeck":
      return { ...state, deck: { ...state.deck, ...action.patch }, dirty: true };
    case "updateSlide": {
      const slides = state.deck.slides.map((s, i) =>
        i === state.slideIndex ? { ...s, ...action.patch } : s,
      );
      return { ...state, deck: { ...state.deck, slides }, dirty: true };
    }
    case "addSlide": {
      const slide =
        action.slide ??
        ({
          id: uid("slide"),
          name: `Slide ${state.deck.slides.length + 1}`,
          background: "#FFFFFF",
          notes: "",
          objects: [],
        } satisfies Slide);
      const slides = [...state.deck.slides, slide];
      return {
        ...state,
        deck: { ...state.deck, slides },
        slideIndex: slides.length - 1,
        selectedId: null,
        dirty: true,
      };
    }
    case "deleteSlide": {
      if (state.deck.slides.length <= 1) return state;
      const slides = state.deck.slides.filter((_, i) => i !== action.index);
      return {
        ...state,
        deck: { ...state.deck, slides },
        slideIndex: Math.min(state.slideIndex, slides.length - 1),
        selectedId: null,
        dirty: true,
      };
    }
    case "addObject": {
      const slides = state.deck.slides.map((s, i) =>
        i === state.slideIndex ? { ...s, objects: [...s.objects, action.object] } : s,
      );
      return {
        ...state,
        deck: { ...state.deck, slides },
        selectedId: action.object.id,
        dirty: true,
      };
    }
    case "updateObject": {
      const slides = state.deck.slides.map((s, i) => {
        if (i !== state.slideIndex) return s;
        return {
          ...s,
          objects: s.objects.map((o) =>
            o.id === action.id ? ({ ...o, ...action.patch } as SlideObject) : o,
          ),
        };
      });
      return { ...state, deck: { ...state.deck, slides }, dirty: true };
    }
    case "deleteObject": {
      const slides = state.deck.slides.map((s, i) =>
        i === state.slideIndex
          ? { ...s, objects: s.objects.filter((o) => o.id !== action.id) }
          : s,
      );
      return {
        ...state,
        deck: { ...state.deck, slides },
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        dirty: true,
      };
    }
    case "reorderObject": {
      const slides = state.deck.slides.map((s, i) => {
        if (i !== state.slideIndex) return s;
        const idx = s.objects.findIndex((o) => o.id === action.id);
        if (idx < 0) return s;
        const next = [...s.objects];
        const swap = action.direction === "up" ? idx + 1 : idx - 1;
        if (swap < 0 || swap >= next.length) return s;
        [next[idx], next[swap]] = [next[swap], next[idx]];
        return { ...s, objects: next };
      });
      return { ...state, deck: { ...state.deck, slides }, dirty: true };
    }
    case "markClean":
      return { ...state, dirty: false };
    default:
      return state;
  }
}

export function useDeckEditor(initial: Deck) {
  const [state, dispatch] = useReducer(reducer, {
    deck: initial,
    slideIndex: 0,
    selectedId: null,
    mode: initial.modeHint,
    dirty: false,
  });
  const saveTimer = useRef<number | null>(null);

  const slide = currentSlide(state);
  const selected = useMemo(
    () => slide.objects.find((o) => o.id === state.selectedId) ?? null,
    [slide, state.selectedId],
  );

  useEffect(() => {
    if (!state.dirty) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void persistDeck(state.deck).then(() => dispatch({ type: "markClean" }));
    }, 500);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state.deck, state.dirty]);

  const load = useCallback((deck: Deck) => {
    dispatch({ type: "replace", deck: clone(deck), mode: deck.modeHint });
  }, []);

  return {
    ...state,
    slide,
    selected,
    dispatch,
    load,
  };
}
