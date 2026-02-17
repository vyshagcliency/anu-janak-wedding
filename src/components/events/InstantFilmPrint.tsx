"use client";

import Image from "next/image";

interface InstantFilmPrintProps {
  src: string;
  alt: string;
  index: number;
  priority?: boolean;
}

// Deterministic tilt per photo — no random at render time
const TILTS = [-2.1, 1.4, -1.8, 2.2, -0.9, 1.7, -2.4, 1.1];

export default function InstantFilmPrint({
  src,
  alt,
  index,
  priority = false,
}: InstantFilmPrintProps) {
  const tilt = TILTS[index % TILTS.length];

  // Alternate portrait / landscape proportions for visual rhythm
  const isPortrait = index % 3 !== 1;
  const width = isPortrait ? 280 : 360;
  const height = isPortrait ? 340 : 280;

  return (
    <div
      className="film-print flex-shrink-0"
      style={{
        transform: `rotate(${tilt}deg)`,
        willChange: "transform, opacity",
      }}
    >
      {/* Matte off-white frame */}
      <div
        className="film-print-frame"
        style={{
          backgroundColor: "#F8F4EE",
          padding: "12px 12px 40px 12px",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.08)",
          borderRadius: "1px",
          width: width + 24,
        }}
      >
        {/* Image area */}
        <div
          style={{
            width,
            height,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#1a1a1a",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 80vw, 360px"
            style={{ objectFit: "cover" }}
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        {/* Bottom caption area — intentionally minimal */}
        <div
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 0,
          }}
        />
      </div>
    </div>
  );
}
