import type { Deck, DeckSummary } from "../types";

const DECKS_KEY = "fal-slides:decks";
const INDEX_KEY = "fal-slides:index";
const SESSION_KEY = "fal-slides:session";

export type LocalSession = {
  email: string;
  name: string;
  provider: "local" | "supabase";
};

function readIndex(): DeckSummary[] {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || "[]") as DeckSummary[];
  } catch {
    return [];
  }
}

function writeIndex(index: DeckSummary[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

function summaryFrom(deck: Deck): DeckSummary {
  return {
    id: deck.id,
    title: deck.title,
    modeHint: deck.modeHint,
    updatedAt: deck.updatedAt,
    slideCount: deck.slides.length,
    shareId: deck.shareId,
  };
}

export function listDecks(): DeckSummary[] {
  return readIndex().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function loadDeck(id: string): Deck | null {
  try {
    const raw = localStorage.getItem(`${DECKS_KEY}:${id}`);
    return raw ? (JSON.parse(raw) as Deck) : null;
  } catch {
    return null;
  }
}

export function loadDeckByShareId(shareId: string): Deck | null {
  const hit = readIndex().find((d) => d.shareId === shareId);
  return hit ? loadDeck(hit.id) : null;
}

export function saveDeck(deck: Deck): Deck {
  const next = { ...deck, updatedAt: new Date().toISOString() };
  localStorage.setItem(`${DECKS_KEY}:${next.id}`, JSON.stringify(next));
  const index = readIndex().filter((d) => d.id !== next.id);
  index.push(summaryFrom(next));
  writeIndex(index);
  return next;
}

export function deleteDeck(id: string) {
  localStorage.removeItem(`${DECKS_KEY}:${id}`);
  writeIndex(readIndex().filter((d) => d.id !== id));
}

export function getSession(): LocalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
}

export function setSession(session: LocalSession | null) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
