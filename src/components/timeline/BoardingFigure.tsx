"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  type: "girl" | "boy";
  /** 0-1 progress through this specific stop region */
  stopProgress: number;
  /** Left position as % of total track */
  position: number;
}

export default function BoardingFigure({ type, stopProgress, position }: Props) {
  const figureRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!figureRef.current) return;

    // Figure walks toward bus (translates right) and fades as it "boards"
    const walkX = stopProgress * 40; // walk up to 40px right
    const opacity = stopProgress > 0.7 ? 1 - (stopProgress - 0.7) / 0.3 : 1;

    gsap.to(figureRef.current, {
      x: walkX,
      opacity,
      duration: 0.3,
      ease: "none",
    });
  }, [stopProgress]);

  return (
    <div
      className="absolute z-15"
      style={{
        left: `${position - 1.5}%`,
        bottom: "18vh",
        transform: "translateX(-50%)",
      }}
    >
      {type === "girl" ? (
        <svg ref={figureRef} width="28" height="50" viewBox="0 0 28 50">
          {/* Head */}
          <circle cx="14" cy="8" r="5" fill="#F5D0A9" />
          {/* Hair */}
          <ellipse cx="14" cy="6" rx="5.5" ry="4" fill="#4A3728" />
          <path d="M8.5,8 Q8,16 10,16" fill="#4A3728" />
          <path d="M19.5,8 Q20,16 18,16" fill="#4A3728" />
          {/* Body / uniform top */}
          <rect x="9" y="13" width="10" height="12" rx="2" fill="#E8E8E8" />
          {/* Collar */}
          <path d="M11,13 L14,17 L17,13" fill="none" stroke="#C9A96E" strokeWidth="1" />
          {/* Skirt */}
          <path d="M8,25 L14,25 L20,25 L22,36 L6,36 Z" fill="#2C3E50" />
          {/* Legs */}
          <rect x="10" y="36" width="3" height="10" fill="#F5D0A9" />
          <rect x="15" y="36" width="3" height="10" fill="#F5D0A9" />
          {/* Shoes */}
          <rect x="9" y="45" width="5" height="3" rx="1" fill="#333" />
          <rect x="14" y="45" width="5" height="3" rx="1" fill="#333" />
          {/* Backpack */}
          <rect x="17" y="14" width="6" height="10" rx="2" fill="#E57373" />
          <line x1="19" y1="14" x2="19" y2="12" stroke="#E57373" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg ref={figureRef} width="28" height="50" viewBox="0 0 28 50">
          {/* Head */}
          <circle cx="14" cy="8" r="5" fill="#F5D0A9" />
          {/* Hair - short */}
          <ellipse cx="14" cy="5.5" rx="5.5" ry="4" fill="#2C1810" />
          {/* Body / uniform shirt */}
          <rect x="9" y="13" width="10" height="14" rx="2" fill="#E8E8E8" />
          {/* Collar */}
          <path d="M11,13 L14,17 L17,13" fill="none" stroke="#C9A96E" strokeWidth="1" />
          {/* Trousers */}
          <rect x="9" y="27" width="4.5" height="14" rx="1" fill="#2C3E50" />
          <rect x="14.5" y="27" width="4.5" height="14" rx="1" fill="#2C3E50" />
          {/* Shoes */}
          <rect x="8" y="40" width="6" height="3" rx="1" fill="#333" />
          <rect x="14" y="40" width="6" height="3" rx="1" fill="#333" />
          {/* Backpack */}
          <rect x="17" y="14" width="6" height="10" rx="2" fill="#42A5F5" />
          <line x1="19" y1="14" x2="19" y2="12" stroke="#42A5F5" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}
