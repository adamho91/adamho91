import type { DustParticle, DustPreset, DustSettings, DustSliders } from "./types";
import presetsJson from "../presets.json";

const presets = presetsJson as DustPreset[];

function num(v: string | number | undefined, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function listPresets(): DustPreset[] {
  return presets;
}

export function getPreset(id: string): DustPreset | undefined {
  return presets.find((p) => p.id === id);
}

export function settingsFromPreset(preset: DustPreset): DustSettings {
  const s = preset.sliders;
  return {
    bg: preset.bg || "#FFFFFF",
    animStyle: (preset.animStyle as DustSettings["animStyle"]) || "voxel",
    colors: preset.colors?.length ? [...preset.colors] : ["#ADFF00", "#000000"],
    sliders: {
      pixSize: num(s.pixSize, 48),
      pixAmt: num(s.pixAmt, 180),
      circlePct: num(s.circlePct, 50),
      squarePct: num(s.squarePct, 50),
      clusterN: num(s.clusterN, 4),
      scatter: num(s.scatter, 10),
      clusterDensity: num(s.clusterDensity, 70),
      waveScale: num(s.waveScale, 40),
      isolines: num(s.isolines, 4),
      animDuration: num(s.animDuration, 4),
      burst: num(s.burst, 1.5),
    },
    noiseSeed: preset.noiseSeed ?? 1,
  };
}

export function defaultDustSettings(): DustSettings {
  const first = presets[0] ?? {
    id: "fallback",
    name: "Default",
    bg: "#000000",
    animStyle: "cluster" as const,
    colors: ["#ADFF00", "#FFFFFF"],
    sliders: {},
    noiseSeed: 12,
  };
  return settingsFromPreset(first as DustPreset);
}

function hash(n: number, seed: number): number {
  const x = Math.sin(n * 127.1 + seed * 17.3) * 43758.5453;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildCluster(
  cx: number,
  cy: number,
  cell: number,
  maxCells: number,
  seed: number,
  density: number,
): { gx: number; gy: number; depth: number }[] {
  const cells = new Set<string>();
  const depth = new Map<string, number>();
  const key = (gx: number, gy: number) => `${gx},${gy}`;
  let sx = Math.round(cx / cell);
  let sy = Math.round(cy / cell);
  cells.add(key(sx, sy));
  depth.set(key(sx, sy), 0);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;
  const queue: { gx: number; gy: number; rem: number; i: number }[] = [
    { gx: sx, gy: sy, rem: 4, i: 0 },
  ];
  let iter = 0;
  while (cells.size < maxCells && queue.length && iter < maxCells * 8) {
    iter++;
    const qi = Math.floor(hash(iter + seed, seed) * queue.length);
    const cur = queue[qi];
    const dir = dirs[Math.floor(hash(iter * 3.1 + seed, seed + 1) * dirs.length)];
    const nx = cur.gx + dir[0];
    const ny = cur.gy + dir[1];
    const k = key(nx, ny);
    if (!cells.has(k) && hash(nx * 19 + ny * 23 + seed, seed) < density / 100 + 0.35) {
      cells.add(k);
      depth.set(k, (depth.get(key(cur.gx, cur.gy)) || 0) + 1);
      queue.push({ gx: nx, gy: ny, rem: cur.rem - 1, i: iter });
    }
    cur.rem -= 1;
    if (cur.rem <= 0) queue.splice(qi, 1);
  }
  return [...cells].map((k) => {
    const [gx, gy] = k.split(",").map(Number);
    return { gx, gy, depth: depth.get(k) || 0 };
  });
}

export function generateParticles(
  width: number,
  height: number,
  settings: DustSettings,
): DustParticle[] {
  const { sliders, colors, noiseSeed } = settings;
  const cell = Math.max(12, Math.round(sliders.pixSize));
  const clusterN = Math.max(1, Math.round(sliders.clusterN));
  const total = Math.max(20, Math.round(sliders.pixAmt));
  const perCluster = Math.max(4, Math.floor(total / clusterN));
  const circleRatio = sliders.circlePct / Math.max(1, sliders.circlePct + sliders.squarePct);
  const particles: DustParticle[] = [];

  for (let c = 0; c < clusterN; c++) {
    const hx = hash(c * 11.3 + 1, noiseSeed);
    const hy = hash(c * 17.7 + 2, noiseSeed);
    const scatter = sliders.scatter / 100;
    const cx = lerp(width * 0.12, width * 0.88, hx) + (hx - 0.5) * width * scatter * 0.3;
    const cy = lerp(height * 0.12, height * 0.88, hy) + (hy - 0.5) * height * scatter * 0.3;
    const cells = buildCluster(cx, cy, cell, perCluster, noiseSeed + c * 9.1, sliders.clusterDensity);
    cells.forEach((cellPos, i) => {
      const color = colors[Math.floor(hash(i + c * 50, noiseSeed) * colors.length) % colors.length];
      const shapeRand = hash(i * 2.4 + c, noiseSeed + 3);
      const sizeMul = lerp(0.35, 1, hash(i + 8, noiseSeed + 4));
      particles.push({
        x: cellPos.gx * cell,
        y: cellPos.gy * cell,
        size: cell * sizeMul,
        shape: shapeRand < circleRatio ? "circle" : "square",
        color,
        phase: hash(i + c * 13, noiseSeed + 5),
        depth: cellPos.depth,
      });
    });
  }

  // Loose decorative singles from scatter
  const loose = Math.round((sliders.scatter / 100) * total * 0.35);
  for (let i = 0; i < loose; i++) {
    particles.push({
      x: hash(i * 5.1, noiseSeed + 20) * width,
      y: hash(i * 7.3, noiseSeed + 21) * height,
      size: cell * lerp(0.25, 0.7, hash(i, noiseSeed + 22)),
      shape: hash(i, noiseSeed + 23) < circleRatio ? "circle" : "square",
      color: colors[Math.floor(hash(i, noiseSeed + 24) * colors.length) % colors.length],
      phase: hash(i, noiseSeed + 25),
      depth: 0,
    });
  }

  return particles;
}

function visibilityForProgress(
  p: DustParticle,
  progress: number,
  style: DustSettings["animStyle"],
  sliders: DustSliders,
): number {
  const breathe = 0.55 + 0.45 * Math.sin(progress * Math.PI * 2 + p.phase * Math.PI * 2);
  if (style === "voxel") {
    const bands = Math.max(1, Math.round(sliders.isolines));
    const wave = Math.sin((p.x + p.y) * (sliders.waveScale / 8000) + progress * Math.PI * 2);
    const band = Math.abs(((wave + 1) / 2) * bands - Math.floor(((wave + 1) / 2) * bands) - 0.5);
    return Math.max(0, 1 - band * 2.2) * breathe;
  }
  if (style === "halftone") {
    const d = Math.hypot(p.x / 1920 - 0.5, p.y / 1080 - 0.5);
    return Math.max(0, 1 - Math.abs(d - progress) * 2.4) * breathe;
  }
  if (style === "stream") {
    const t = ((p.x / 1920 + progress) % 1 + 1) % 1;
    return (t > 0.15 && t < 0.85 ? 1 : t * 2) * breathe;
  }
  // cluster: build / hold / fade
  const build = 0.3;
  const fade = 0.7;
  let env = 1;
  if (progress < build) env = progress / build;
  else if (progress > fade) env = 1 - (progress - fade) / (1 - fade);
  const delay = p.phase * 0.25;
  return Math.max(0, Math.min(1, (env - delay) / (1 - delay + 0.01))) * (0.7 + 0.3 * breathe);
}

export function renderDustFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: DustSettings,
  particles: DustParticle[],
  progress: number,
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = settings.bg;
  ctx.fillRect(0, 0, width, height);

  const burst = settings.sliders.burst;
  for (const p of particles) {
    const vis = visibilityForProgress(p, progress, settings.animStyle, settings.sliders);
    if (vis < 0.03) continue;
    const scale = lerp(0.2, 1, vis) * (0.85 + 0.15 * burst);
    const size = p.size * scale;
    const ox = (p.phase - 0.5) * (1 - vis) * 18;
    const oy = (p.phase - 0.5) * (1 - vis) * 12;
    ctx.globalAlpha = Math.min(1, vis * 1.15);
    ctx.fillStyle = p.color;
    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(p.x + ox + size / 2, p.y + oy + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(p.x + ox, p.y + oy, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

export function createDustController(settings: DustSettings, width = 1920, height = 1080) {
  let current = { ...settings, sliders: { ...settings.sliders }, colors: [...settings.colors] };
  let particles = generateParticles(width, height, current);
  let progress = 0.35;
  let playing = false;
  let raf = 0;
  let last = 0;

  return {
    getSettings: () => current,
    getProgress: () => progress,
    getParticles: () => particles,
    setSettings(next: DustSettings) {
      current = { ...next, sliders: { ...next.sliders }, colors: [...next.colors] };
      particles = generateParticles(width, height, current);
    },
    setProgress(p: number) {
      progress = Math.max(0, Math.min(1, p));
    },
    applyPreset(preset: DustPreset) {
      this.setSettings(settingsFromPreset(preset));
    },
    render(ctx: CanvasRenderingContext2D) {
      renderDustFrame(ctx, width, height, current, particles, progress);
    },
    play(ctx: CanvasRenderingContext2D, onFrame?: (p: number) => void) {
      playing = true;
      last = performance.now();
      const tick = (now: number) => {
        if (!playing) return;
        const dur = Math.max(1, current.sliders.animDuration) * 1000;
        progress = (progress + (now - last) / dur) % 1;
        last = now;
        this.render(ctx);
        onFrame?.(progress);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    },
    pause() {
      playing = false;
      cancelAnimationFrame(raf);
    },
    destroy() {
      this.pause();
    },
  };
}

export type DustController = ReturnType<typeof createDustController>;
