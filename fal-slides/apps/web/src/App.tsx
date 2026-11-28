import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { EditorPage } from "./pages/EditorPage";
import { PresentPage } from "./pages/PresentPage";
import { fetchRemoteDeck } from "./lib/cloud";
import type { Deck } from "./types";

function EditRoute() {
  const { id = "" } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await fetchRemoteDeck(id);
      if (cancelled) return;
      if (!loaded) setMissing(true);
      else setDeck(loaded);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (missing) return <Navigate to="/" replace />;
  if (!deck) return <div className="loading">Loading deck…</div>;
  return <EditorPage key={deck.id} deck={deck} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit/:id" element={<EditRoute />} />
      <Route path="/present/:id" element={<PresentPage />} />
      <Route path="/p/:id" element={<PresentPage byShare />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
