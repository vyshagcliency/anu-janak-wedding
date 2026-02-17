"use client";

interface StyleGuideCardProps {
  onClick: () => void;
  accentColor: string;
}

export default function StyleGuideCard({
  onClick,
  accentColor,
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-1.2deg)",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s",
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
        {/* Inner bordered area */}
        <div
          style={{
            width: "100%",
            height: "100%",
            border: `1px solid ${accentColor}40`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
          }}
        >
          {/* Decorative rule */}
          <div
            style={{
              width: 40,
              height: 1,
              background: accentColor,
              opacity: 0.6,
            }}
          />

          {/* Serif heading */}
          <p
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "#2C2C2C",
              letterSpacing: "0.06em",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Style
            <br />
            Guide
          </p>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#5A5A5A",
              textAlign: "center",
            }}
          >
            Tap to explore
          </p>

          {/* Decorative rule */}
          <div
            style={{
              width: 40,
              height: 1,
              background: accentColor,
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    </button>
  );
}
