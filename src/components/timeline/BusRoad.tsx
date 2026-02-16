"use client";

export default function BusRoad() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full"
      style={{
        height: "18vh",
      }}
    >
      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 h-full w-full"
        style={{ background: "#C4A77D" }}
      />

      {/* Grass strip above road */}
      <div
        className="absolute bottom-[12vh] left-0 h-[6vh] w-full"
        style={{
          background: "linear-gradient(180deg, #7CB668 0%, #6BA05A 100%)",
        }}
      />

      {/* Road */}
      <svg
        viewBox="0 0 6000 120"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: "12vh" }}
      >
        {/* Road surface with asphalt texture gradient */}
        <defs>
          <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="30%" stopColor="#555555" />
            <stop offset="70%" stopColor="#505050" />
            <stop offset="100%" stopColor="#484848" />
          </linearGradient>
        </defs>
        <rect x="0" y="20" width="6000" height="70" fill="url(#asphalt)" rx="4" />

        {/* Subtle gravel texture dots */}
        {Array.from({ length: 60 }).map((_, i) => (
          <circle
            key={`gravel-${i}`}
            cx={i * 100 + 50}
            cy={45 + (i % 3) * 12}
            r="1"
            fill="#5E5E5E"
            opacity="0.3"
          />
        ))}

        {/* Road lines - dashed center */}
        <line
          x1="0"
          y1="55"
          x2="6000"
          y2="55"
          stroke="#EEEE99"
          strokeWidth="3"
          strokeDasharray="40 30"
        />

        {/* Road edge lines (solid) */}
        <line x1="0" y1="23" x2="6000" y2="23" stroke="#888" strokeWidth="2" />
        <line x1="0" y1="87" x2="6000" y2="87" stroke="#888" strokeWidth="2" />

        {/* Shoulder lines (subtle) */}
        <line x1="0" y1="20" x2="6000" y2="20" stroke="#999" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="90" x2="6000" y2="90" stroke="#999" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}
