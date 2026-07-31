import { useNavigate } from "react-router-dom";
import type { Deck } from "../types";
import { useDeckEditor } from "../lib/useDeckEditor";
import { Filmstrip } from "../components/Filmstrip";
import { Toolbar } from "../components/Toolbar";
import { SlideCanvas } from "../components/SlideCanvas";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { persistDeck } from "../lib/cloud";

type Props = {
  deck: Deck;
};

export function EditorPage({ deck: initial }: Props) {
  const nav = useNavigate();
  const editor = useDeckEditor(initial);

  const exportPng = async () => {
    const artboard = document.querySelector(".slide-artboard") as HTMLElement | null;
    if (!artboard) return;
    // Simple export via foreignObject SVG snapshot of scaled artboard background + note
    // Prefer canvas-based capture of dust + HTML overlay: use html-to-image style via SVG.
    try {
      const { toPng } = await import("../lib/exportPng");
      const dataUrl = await toPng(artboard);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${editor.deck.title.replace(/\s+/g, "-").toLowerCase()}-slide-${editor.slideIndex + 1}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("PNG export failed. Try again after fonts load.");
    }
  };

  return (
    <div className="editor-shell">
      <Toolbar
        mode={editor.mode}
        onModeChange={(mode) => editor.dispatch({ type: "setMode", mode })}
        onInsert={(object) => editor.dispatch({ type: "addObject", object })}
        onPresent={() => {
          void persistDeck(editor.deck).then(() => nav(`/present/${editor.deck.id}`));
        }}
        onExportPng={() => void exportPng()}
        onHome={() => {
          void persistDeck(editor.deck).then(() => nav("/"));
        }}
        title={editor.deck.title}
        onTitleChange={(title) => editor.dispatch({ type: "updateDeck", patch: { title } })}
        dirty={editor.dirty}
      />
      <div className="editor-body">
        <Filmstrip
          slides={editor.deck.slides}
          activeIndex={editor.slideIndex}
          onSelect={(index) => editor.dispatch({ type: "selectSlide", index })}
          onAdd={() => editor.dispatch({ type: "addSlide" })}
          onDelete={(index) => editor.dispatch({ type: "deleteSlide", index })}
        />
        <main className="editor-main">
          <SlideCanvas
            slide={editor.slide}
            selectedId={editor.selectedId}
            onSelect={(id) => editor.dispatch({ type: "selectObject", id })}
            onChangeObject={(id, patch) => editor.dispatch({ type: "updateObject", id, patch })}
          />
          {editor.deck.shareId ? (
            <div className="share-bar">
              Share / present link:{" "}
              <code>{`${window.location.origin}/p/${editor.deck.shareId}`}</code>
              <button
                type="button"
                className="btn ghost"
                onClick={() =>
                  void navigator.clipboard.writeText(`${window.location.origin}/p/${editor.deck.shareId}`)
                }
              >
                Copy
              </button>
            </div>
          ) : null}
        </main>
        <PropertiesPanel
          mode={editor.mode}
          slide={editor.slide}
          selected={editor.selected}
          onUpdateSlide={(patch) => editor.dispatch({ type: "updateSlide", patch })}
          onUpdateObject={(id, patch) => editor.dispatch({ type: "updateObject", id, patch })}
          onDeleteObject={(id) => editor.dispatch({ type: "deleteObject", id })}
          onReorder={(id, direction) => editor.dispatch({ type: "reorderObject", id, direction })}
        />
      </div>
    </div>
  );
}
