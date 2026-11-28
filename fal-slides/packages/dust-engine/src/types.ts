export type DustSliders = {
  pixSize: number;
  pixAmt: number;
  circlePct: number;
  squarePct: number;
  clusterN: number;
  scatter: number;
  clusterDensity: number;
  waveScale: number;
  isolines: number;
  animDuration: number;
  burst: number;
};

export type DustSettings = {
  bg: string;
  animStyle: "voxel" | "cluster" | "halftone" | "stream";
  colors: string[];
  sliders: DustSliders;
  noiseSeed: number;
};

export type DustPreset = {
  id: string;
  name: string;
  builtin?: boolean;
  bg: string;
  animStyle: DustSettings["animStyle"];
  colors: string[];
  sliders: Record<string, string>;
  noiseSeed: number;
};

export type DustParticle = {
  x: number;
  y: number;
  size: number;
  shape: "circle" | "square";
  color: string;
  phase: number;
  depth: number;
};
