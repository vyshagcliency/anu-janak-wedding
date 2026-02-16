"use client";

import { useEffect, useRef } from "react";

/* 40 confetti pieces with randomised shapes, colours, positions & timings */
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: 2 + (i * 237) % 96, // spread across viewport width (%)
  delay: (i * 0.17) % 2.4, // staggered start (s)
  duration: 2.4 + (i * 0.13) % 1.8, // how long to fall (s)
  size: 5 + (i % 5) * 2, // px
  rotation: (i * 53) % 360,
  shape: i % 4, // 0=square 1=circle 2=diamond 3=strip
  color: [
    "#C9A96E", // gold
    "#E8D5B0", // champagne
    "#F0DDD5", // blush
    "#EF9A9A", // rose
    "#B39DDB", // lavender
    "#80CBC4", // teal
    "#FFD54F", // yellow gold
    "#A5D6A7", // sage
  ][i % 8],
  drift: ((i % 7) - 3) * 30, // horizontal drift px
}));

interface Props {
  active: boolean;
}

export default function CelebrationBurst({ active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // When active changes to true, restart animations by re-mounting via key
  // We do this by toggling an opacity so the burst plays every time you arrive
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.opacity = active ? "1" : "0";
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ transition: "opacity 0.4s" }}
    >
      {PIECES.map((p) => {
        const borderRadius =
          p.shape === 1
            ? "50%"
            : p.shape === 2
            ? "0"
            : p.shape === 3
            ? "2px"
            : "3px";

        const transform =
          p.shape === 2
            ? `rotate(${p.rotation}deg) translateX(${p.drift}px)`
            : `rotate(${p.rotation}deg)`;

        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: "-5%",
              width: p.shape === 3 ? `${p.size * 0.4}px` : `${p.size}px`,
              height: p.shape === 3 ? `${p.size * 2.5}px` : `${p.size}px`,
              background: p.color,
              borderRadius,
              transform,
              animation: `confettiFall ${p.duration}s ${p.delay}s ease-in 2 forwards`,
              opacity: 0.85,
            }}
          />
        );
      })}

      {/* Central golden sparkle burst */}
      <svg
        className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
        width="160"
        height="160"
        viewBox="0 0 160 160"
        style={{ animation: "sparkBurst 0.6s ease-out forwards" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="80"
            y1="80"
            x2={80 + Math.cos((angle * Math.PI) / 180) * 70}
            y2={80 + Math.sin((angle * Math.PI) / 180) * 70}
            stroke="#C9A96E"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            style={{
              animation: `sparkRay 0.5s ${i * 0.04}s ease-out forwards`,
            }}
          />
        ))}
        <circle cx="80" cy="80" r="6" fill="#C9A96E" opacity="0.8" />
      </svg>
    </div>
  );
}
