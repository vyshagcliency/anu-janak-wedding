"use client";

import Image from "next/image";

interface StyleGuideCardProps {
  onClick: () => void;
  accentColor: string;
  imageSrc: string;
  imageAlt: string;
}

export default function StyleGuideCard({
  onClick,
  accentColor,
  imageSrc,
  imageAlt,
}: StyleGuideCardProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open style guide"
      className="style-guide-card flex-shrink-0"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {/* Matte frame — same visual language as InstantFilmPrint */}
      <div
        style={{
          backgroundColor: "#F8F4EE",
          padding: "12px 12px 40px 12px",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.08)",
          borderRadius: "1px",
          width: 304,
          height: 392,
          transform: "rotate(-1.2deg)",
          overflow: "hidden",
          position: "relative" as const,
          transition:
            "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "rotate(0deg) scale(1.03)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 8px 16px rgba(0,0,0,0.2), 0 24px 48px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "rotate(-1.2deg)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 8px rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.08)";
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="304px"
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              padding: "36px 16px 16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "1.2rem",
                color: "#F8F4EE",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              Style Guide
            </p>
            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(248,244,238,0.6)",
              }}
            >
              Tap to expand
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
