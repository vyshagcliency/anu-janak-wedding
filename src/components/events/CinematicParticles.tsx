"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { PARTICLE_CONFIGS, type ParticleShape } from "./cinematic-types";

export interface CinematicParticlesHandle {
  update(progress: number): void;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  angle: number;
  rotation: number;
  rotationSpeed: number;
  phase: number; // unique offset for sine-wave drift
}

const ZONE_BOUNDARIES = [0.0, 0.25, 0.50, 0.75, 1.0];

function getZoneIndex(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.50) return 1;
  if (progress < 0.75) return 2;
  return 3;
}

function getTransitionFactor(progress: number): {
  fromZone: number;
  toZone: number;
  t: number;
} {
  const zone = getZoneIndex(progress);
  const zoneStart = ZONE_BOUNDARIES[zone];
  const zoneEnd = ZONE_BOUNDARIES[zone + 1];
  const zoneMid = (zoneStart + zoneEnd) / 2;

  // Transition region: 0.05 around boundary
  const transitionWidth = 0.05;

  if (zone > 0 && progress < zoneStart + transitionWidth) {
    const t = (progress - zoneStart) / transitionWidth;
    return { fromZone: zone - 1, toZone: zone, t };
  }
  if (zone < 3 && progress > zoneEnd - transitionWidth) {
    const t = (progress - (zoneEnd - transitionWidth)) / transitionWidth;
    return { fromZone: zone, toZone: zone + 1, t };
  }

  return { fromZone: zone, toZone: zone, t: 0 };
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 255, 255];
}

const CinematicParticles = forwardRef<CinematicParticlesHandle>(
  function CinematicParticles(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const progressRef = useRef(0);
    const isMobileRef = useRef(false);

    // Initialize particles
    useEffect(() => {
      isMobileRef.current = window.innerWidth < 768;
      const maxCount = Math.max(...PARTICLE_CONFIGS.map((c) => c.count));
      const count = isMobileRef.current
        ? Math.floor(maxCount * 0.5)
        : maxCount;

      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random();
        const y = Math.random();
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: 2,
          color: "#FFFFFF",
          opacity: 0.5,
          speed: 0.2 + Math.random() * 0.3,
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;

      // Size canvas
      const resize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    const drawParticles = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const progress = progressRef.current;
      const { fromZone, toZone, t: transitionT } = getTransitionFactor(progress);

      const fromConfig = PARTICLE_CONFIGS[fromZone];
      const toConfig = PARTICLE_CONFIGS[toZone];
      const isMobile = isMobileRef.current;

      const activeCount = isMobile
        ? Math.floor(
            ((1 - transitionT) * fromConfig.count +
              transitionT * toConfig.count) *
              0.5
          )
        : Math.floor(
            (1 - transitionT) * fromConfig.count +
              transitionT * toConfig.count
          );

      ctx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.001;

      const particles = particlesRef.current;
      for (let i = 0; i < Math.min(activeCount, particles.length); i++) {
        const p = particles[i];

        // Interpolate config values
        const size =
          (1 - transitionT) *
            (fromConfig.minSize +
              (p.speed / 0.5) * (fromConfig.maxSize - fromConfig.minSize)) +
          transitionT *
            (toConfig.minSize +
              (p.speed / 0.5) * (toConfig.maxSize - toConfig.minSize));

        const colorFrom =
          fromConfig.colors[i % fromConfig.colors.length];
        const colorTo =
          toConfig.colors[i % toConfig.colors.length];

        const [r1, g1, b1] = hexToRgb(colorFrom);
        const [r2, g2, b2] = hexToRgb(colorTo);
        const r = Math.round(r1 + (r2 - r1) * transitionT);
        const g = Math.round(g1 + (g2 - g1) * transitionT);
        const b = Math.round(b1 + (b2 - b1) * transitionT);

        // Movement based on direction
        const dirSpeed =
          (1 - transitionT) * fromConfig.speed +
          transitionT * toConfig.speed;

        // Compute direction blend
        const dirFrom = fromConfig.direction;
        const dirTo = toConfig.direction;

        let dy = 0;
        if (dirFrom === "up" || dirTo === "up") {
          const upFactor =
            (dirFrom === "up" ? 1 - transitionT : 0) +
            (dirTo === "up" ? transitionT : 0);
          dy -= dirSpeed * upFactor;
        }
        if (dirFrom === "down" || dirTo === "down") {
          const downFactor =
            (dirFrom === "down" ? 1 - transitionT : 0) +
            (dirTo === "down" ? transitionT : 0);
          dy += dirSpeed * downFactor;
        }

        const driftX = Math.sin(time * 0.5 + p.phase) * 0.003;
        const driftY = dy * 0.002;

        p.x = ((p.x + driftX + 1) % 1 + 1) % 1;
        p.y = ((p.y + driftY + 1) % 1 + 1) % 1;
        p.rotation += p.rotationSpeed;

        const px = p.x * w;
        const py = p.y * h;

        // Opacity pulse
        const baseOpacity =
          0.3 + 0.4 * Math.sin(time * 0.8 + p.phase);
        const opacity =
          fromZone !== toZone
            ? baseOpacity * (0.5 + 0.5 * (1 - Math.abs(transitionT - 0.5) * 2))
            : baseOpacity;

        // Determine shape blend
        const shape: ParticleShape =
          transitionT < 0.5 ? fromConfig.type : toConfig.type;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = opacity;

        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fill();
        } else if (shape === "glow") {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
          gradient.addColorStop(0, `rgba(${r},${g},${b},0.8)`);
          gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`);
          gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        } else if (shape === "ellipse") {
          ctx.beginPath();
          ctx.ellipse(0, 0, size * 1.5, size * 0.6, p.rotation, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fill();
        } else if (shape === "star") {
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          drawStar(ctx, 0, 0, size, 4);
        }

        ctx.restore();
      }
    }, []);

    useImperativeHandle(ref, () => ({
      update(progress: number) {
        progressRef.current = progress;
        drawParticles();
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: "transform" }}
      />
    );
  }
);

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  points: number
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? size : size * 0.4;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

export default CinematicParticles;
