import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, blankDeck } from "../templates";
import { deleteDeck, getSession, listDecks, setSession, type LocalSession } from "../lib/storage";
import { persistDeck, isSupabaseConfigured, signInWithGoogle } from "../lib/cloud";
import type { DeckSummary } from "../types";

export function HomePage() {
  const nav = useNavigate();
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [session, setSessionState] = useState<LocalSession | null>(getSession());
  const [email, setEmail] = useState("you@fal.ai");

  const refresh = () => setDecks(listDecks());

  useEffect(() => {
    refresh();
  }, []);

  const signInLocal = () => {
    const next = { email, name: email.split("@")[0] || "fal", provider: "local" as const };
    setSession(next);
    setSessionState(next);
  };

  const signOut = () => {
    setSession(null);
    setSessionState(null);
  };

  const openTemplate = async (templateId: string) => {
    const t = TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    const deck = t.build();
    if (session) deck.owners = [session.email];
    await persistDeck(deck);
    nav(`/edit/${deck.id}`);
  };

  const openBlank = async (mode: "sales" | "marketing") => {
    const deck = blankDeck(mode);
    if (session) deck.owners = [session.email];
    await persistDeck(deck);
    nav(`/edit/${deck.id}`);
  };

  return (
    <div className="home">
      <header className="home-hero">
        <div>
          <p className="eyebrow">fal · brand-locked</p>
          <h1>Slides</h1>
          <p className="lede">
            16:9 decks with Focal preloaded, chart inserts, and Glitch Dust — built for sales, open enough for marketing.
          </p>
        </div>
        <div className="auth-card">
          {session ? (
            <>
              <p className="mono">{session.email}</p>
              <button type="button" className="btn" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <label className="field">
                <span>Work email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <button type="button" className="btn primary" onClick={signInLocal}>
                Continue
              </button>
              {isSupabaseConfigured() ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => void signInWithGoogle()}
                >
                  Google SSO (Supabase)
                </button>
              ) : (
                <p className="hint">Local auth active. Set VITE_SUPABASE_URL + ANON_KEY for Google SSO.</p>
              )}
            </>
          )}
        </div>
      </header>

      <section className="home-section">
        <div className="section-head">
          <h2>Start from template</h2>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => void openBlank("sales")}>
              Blank sales
            </button>
            <button type="button" className="btn" onClick={() => void openBlank("marketing")}>
              Blank marketing
            </button>
          </div>
        </div>
        <div className="template-grid">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="template-card"
              onClick={() => void openTemplate(t.id)}
            >
              <span className="mode-tag">{t.mode}</span>
              <strong>{t.label}</strong>
              <span>{t.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Your decks</h2>
        </div>
        {decks.length === 0 ? (
          <p className="muted">No decks yet — pick a template above.</p>
        ) : (
          <ul className="deck-list">
            {decks.map((d) => (
              <li key={d.id}>
                <button type="button" className="deck-row" onClick={() => nav(`/edit/${d.id}`)}>
                  <div>
                    <strong>{d.title}</strong>
                    <span className="mono">
                      {d.modeHint} · {d.slideCount} slides · {new Date(d.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  className="btn danger ghost"
                  onClick={() => {
                    deleteDeck(d.id);
                    refresh();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
