"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";
import { SKY_KEYFRAMES, getSkyInterpolation } from "./cinematic-types";

export interface CinematicSkyHandle {
  update(progress: number): void;
}

const CinematicSky = forwardRef<CinematicSkyHandle>(function CinematicSky(
  _,
  ref
) {
  const mainRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    update(progress: number) {
      const { from, to, t } = getSkyInterpolation(progress);

      const lerp = (a: string, b: string) =>
        gsap.utils.interpolate(a, b, t) as string;

      const topColor = lerp(from.topColor, to.topColor);
      const midColor = lerp(from.midColor, to.midColor);
      const bottomColor = lerp(from.bottomColor, to.bottomColor);
      const horizonGlow = lerp(from.horizonGlow, to.horizonGlow);
      const horizonOpacity = gsap.utils.interpolate(
        from.horizonOpacity,
        to.horizonOpacity,
        t
      );
      const ambientColor = lerp(from.ambientColor, to.ambientColor);
      const ambientOpacity = gsap.utils.interpolate(
        from.ambientOpacity,
        to.ambientOpacity,
        t
      );

      if (mainRef.current) {
        mainRef.current.style.background = `linear-gradient(to bottom, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;
      }
      if (horizonRef.current) {
        horizonRef.current.style.background = `radial-gradient(ellipse 120% 40% at 50% 100%, ${horizonGlow} 0%, transparent 70%)`;
        horizonRef.current.style.opacity = String(horizonOpacity);
      }
      if (ambientRef.current) {
        ambientRef.current.style.background = `radial-gradient(ellipse 80% 60% at 50% 40%, ${ambientColor} 0%, transparent 70%)`;
        ambientRef.current.style.opacity = String(ambientOpacity);
      }
    },
  }));

  // Set initial sky state from first keyframe
  const k0 = SKY_KEYFRAMES[0];
  const initialGradient = `linear-gradient(to bottom, ${k0.topColor} 0%, ${k0.midColor} 50%, ${k0.bottomColor} 100%)`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main sky gradient */}
      <div
        ref={mainRef}
        className="absolute inset-0"
        style={{
          background: initialGradient,
          willChange: "background",
        }}
      />
      {/* Horizon glow */}
      <div
        ref={horizonRef}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 40% at 50% 100%, ${k0.horizonGlow} 0%, transparent 70%)`,
          opacity: k0.horizonOpacity,
          willChange: "background, opacity",
        }}
      />
      {/* Ambient light */}
      <div
        ref={ambientRef}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${k0.ambientColor} 0%, transparent 70%)`,
          opacity: k0.ambientOpacity,
          willChange: "background, opacity",
        }}
      />
    </div>
  );
});

export default CinematicSky;
