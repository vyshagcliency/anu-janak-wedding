"use client";

export default function BusRoad() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full"
      style={{ height: "18vh" }}
    >
      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 h-full w-full"
        style={{ background: "#C4A77D" }}
      />

      {/* Road */}
      <svg
        viewBox="0 0 6000 120"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: "12vh" }}
      >
        {/* Road surface */}
        <rect x="0" y="20" width="6000" height="70" fill="#555555" rx="4" />

        {/* Road lines — dashed center */}
        <line
          x1="0"
          y1="55"
          x2="6000"
          y2="55"
          stroke="#DDDDAA"
          strokeWidth="3"
          strokeDasharray="40 30"
        />

        {/* Road edge lines */}
        <line x1="0" y1="24" x2="6000" y2="24" stroke="#777" strokeWidth="2" />
        <line x1="0" y1="86" x2="6000" y2="86" stroke="#777" strokeWidth="2" />
      </svg>

      {/* Grass strip above road */}
      <div
        className="absolute bottom-[12vh] left-0 h-[6vh] w-full"
        style={{
          background: "linear-gradient(180deg, #7CB668 0%, #6BA05A 100%)",
        }}
      />
    </div>
  );
}
