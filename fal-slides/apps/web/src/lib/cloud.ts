import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Deck } from "../types";
import * as local from "./storage";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon);
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) client = createClient(url!, anon!);
  return client;
}

/** Cloud sync: when Supabase is configured, upsert deck JSON; always mirror locally. */
export async function persistDeck(deck: Deck): Promise<Deck> {
  const saved = local.saveDeck(deck);
  const sb = getSupabase();
  if (!sb) return saved;
  try {
    await sb.from("decks").upsert({
      id: saved.id,
      title: saved.title,
      payload: saved,
      share_id: saved.shareId,
      updated_at: saved.updatedAt,
    });
  } catch (err) {
    console.warn("Supabase upsert failed; local save kept", err);
  }
  return saved;
}

export async function fetchRemoteDeck(id: string): Promise<Deck | null> {
  const sb = getSupabase();
  if (!sb) return local.loadDeck(id);
  try {
    const { data, error } = await sb.from("decks").select("payload").eq("id", id).maybeSingle();
    if (error || !data?.payload) return local.loadDeck(id);
    const deck = data.payload as Deck;
    local.saveDeck(deck);
    return deck;
  } catch {
    return local.loadDeck(id);
  }
}

export async function signInWithGoogle(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  return !error;
}
