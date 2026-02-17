// ─── Cinematic Events Section — Shared Types & Constants ───

export interface EventProgressRange {
  start: number;
  peak: number;
  end: number;
}

export const EVENT_PROGRESS_RANGES: EventProgressRange[] = [
  { start: 0.00, peak: 0.10, end: 0.25 },  // Sundowner
  { start: 0.22, peak: 0.35, end: 0.50 },  // Sangeet
  { start: 0.47, peak: 0.60, end: 0.75 },  // Wedding
  { start: 0.72, peak: 0.85, end: 1.00 },  // Reception
];

export interface SkyKeyframe {
  progress: number;
  topColor: string;
  midColor: string;
  bottomColor: string;
  horizonGlow: string;
  horizonOpacity: number;
  ambientColor: string;
  ambientOpacity: number;
}

export const SKY_KEYFRAMES: SkyKeyframe[] = [
  {
    progress: 0.00,
    topColor: "#4A1A2E",
    midColor: "#C2544A",
    bottomColor: "#E8985A",
    horizonGlow: "#FF8C42",
    horizonOpacity: 0.6,
    ambientColor: "#FFB347",
    ambientOpacity: 0.15,
  },
  {
    progress: 0.25,
    topColor: "#0D1B2A",
    midColor: "#1B2D4F",
    bottomColor: "#2E4066",
    horizonGlow: "#4A3F8A",
    horizonOpacity: 0.3,
    ambientColor: "#6C63FF",
    ambientOpacity: 0.08,
  },
  {
    progress: 0.50,
    topColor: "#F5E6D3",
    midColor: "#FAF7F2",
    bottomColor: "#E8D5B0",
    horizonGlow: "#C9A96E",
    horizonOpacity: 0.4,
    ambientColor: "#D4A833",
    ambientOpacity: 0.12,
  },
  {
    progress: 0.75,
    topColor: "#0A0A14",
    midColor: "#12121F",
    bottomColor: "#1A1A2E",
    horizonGlow: "#C9A96E",
    horizonOpacity: 0.15,
    ambientColor: "#C9A96E",
    ambientOpacity: 0.05,
  },
  {
    progress: 1.00,
    topColor: "#050510",
    midColor: "#0A0A18",
    bottomColor: "#111122",
    horizonGlow: "#C9A96E",
    horizonOpacity: 0.1,
    ambientColor: "#C9A96E",
    ambientOpacity: 0.03,
  },
];

export type ParticleShape = "circle" | "glow" | "ellipse" | "star";

export interface ParticleConfig {
  type: ParticleShape;
  count: number;
  colors: string[];
  minSize: number;
  maxSize: number;
  speed: number;
  direction: "up" | "down" | "float";
}

export const PARTICLE_CONFIGS: ParticleConfig[] = [
  {
    type: "circle",
    count: 40,
    colors: ["#FFB347", "#FF8C42", "#C9A96E", "#E8985A"],
    minSize: 1,
    maxSize: 3,
    speed: 0.3,
    direction: "up",
  },
  {
    type: "glow",
    count: 25,
    colors: ["#6C63FF", "#A5B4FC", "#FFFFFF", "#C7D2FE"],
    minSize: 2,
    maxSize: 5,
    speed: 0.2,
    direction: "float",
  },
  {
    type: "ellipse",
    count: 30,
    colors: ["#F0DDD5", "#E8D5B0", "#FAF7F2", "#F5C6D0"],
    minSize: 3,
    maxSize: 6,
    speed: 0.4,
    direction: "down",
  },
  {
    type: "star",
    count: 35,
    colors: ["#C9A96E", "#FFD700", "#E8D5B0", "#BDBDBD"],
    minSize: 1.5,
    maxSize: 4,
    speed: 0.5,
    direction: "up",
  },
];

/** Utility: get the two bounding sky keyframes and local interpolation factor */
export function getSkyInterpolation(progress: number): {
  from: SkyKeyframe;
  to: SkyKeyframe;
  t: number;
} {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < SKY_KEYFRAMES.length - 1; i++) {
    const from = SKY_KEYFRAMES[i];
    const to = SKY_KEYFRAMES[i + 1];
    if (clamped <= to.progress) {
      const range = to.progress - from.progress;
      const t = range > 0 ? (clamped - from.progress) / range : 0;
      return { from, to, t };
    }
  }
  const last = SKY_KEYFRAMES[SKY_KEYFRAMES.length - 1];
  return { from: last, to: last, t: 0 };
}

/** Utility: compute event visibility (0→1→0) for a given progress */
export function getEventVisibility(
  progress: number,
  range: EventProgressRange
): number {
  if (progress < range.start || progress > range.end) return 0;
  if (progress <= range.peak) {
    const fadeIn = range.peak - range.start;
    return fadeIn > 0 ? (progress - range.start) / fadeIn : 1;
  }
  const fadeOut = range.end - range.peak;
  return fadeOut > 0 ? 1 - (progress - range.peak) / fadeOut : 1;
}
