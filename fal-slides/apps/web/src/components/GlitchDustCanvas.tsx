import { useEffect, useRef } from "react";
import {
  createDustController,
  type DustSettings,
} from "@fal-slides/dust-engine";

type Props = {
  settings: DustSettings;
  progress: number;
  autoplay?: boolean;
  width?: number;
  height?: number;
  className?: string;
  onProgress?: (p: number) => void;
};

export function GlitchDustCanvas({
  settings,
  progress,
  autoplay = false,
  width = 1920,
  height = 1080,
  className,
  onProgress,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<ReturnType<typeof createDustController> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctrl = createDustController(settings, width, height);
    ctrl.setProgress(progress);
    ctrl.render(ctx);
    ctrlRef.current = ctrl;
    return () => ctrl.destroy();
    // intentional: recreate when structural settings change via JSON key below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, JSON.stringify(settings)]);

  useEffect(() => {
    const ctrl = ctrlRef.current;
    const canvas = canvasRef.current;
    if (!ctrl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctrl.setProgress(progress);
    if (!autoplay) ctrl.render(ctx);
  }, [progress, autoplay]);

  useEffect(() => {
    const ctrl = ctrlRef.current;
    const canvas = canvasRef.current;
    if (!ctrl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (autoplay) {
      ctrl.play(ctx, onProgress);
      return () => ctrl.pause();
    }
    ctrl.pause();
    ctrl.render(ctx);
  }, [autoplay, onProgress]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
