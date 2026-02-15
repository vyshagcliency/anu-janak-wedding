"use client";

export default function ParallaxLayers() {
  return (
    <>
      {/* Sky layer */}
      <div
        className="parallax-sky absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #D4E7F7 0%, #E8D5B0 40%, #F5E6D3 100%)",
        }}
      />

      {/* Clouds */}
      <div className="parallax-clouds absolute inset-0 overflow-hidden">
        <svg className="absolute top-[8%] left-[5%] opacity-40" width="200" height="60" viewBox="0 0 200 60">
          <ellipse cx="60" cy="40" rx="60" ry="20" fill="white" />
          <ellipse cx="100" cy="30" rx="50" ry="22" fill="white" />
          <ellipse cx="150" cy="38" rx="45" ry="18" fill="white" />
        </svg>
        <svg className="absolute top-[15%] left-[40%] opacity-30" width="160" height="50" viewBox="0 0 160 50">
          <ellipse cx="50" cy="32" rx="50" ry="18" fill="white" />
          <ellipse cx="90" cy="25" rx="40" ry="20" fill="white" />
          <ellipse cx="120" cy="30" rx="35" ry="16" fill="white" />
        </svg>
        <svg className="absolute top-[5%] left-[70%] opacity-25" width="180" height="55" viewBox="0 0 180 55">
          <ellipse cx="55" cy="35" rx="55" ry="20" fill="white" />
          <ellipse cx="100" cy="28" rx="45" ry="22" fill="white" />
          <ellipse cx="140" cy="34" rx="40" ry="17" fill="white" />
        </svg>
      </div>

      {/* Hills layer */}
      <div className="parallax-hills absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 6000 300"
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "35vh" }}
        >
          {/* Far hills */}
          <path
            d="M0,200 Q300,100 600,180 Q900,80 1200,160 Q1500,60 1800,150 Q2100,90 2400,170 Q2700,70 3000,140 Q3300,100 3600,180 Q3900,60 4200,150 Q4500,80 4800,160 Q5100,100 5400,140 L5400,300 Q5700,100 6000,180 L6000,300 L0,300 Z"
            fill="#8DB580"
            opacity="0.5"
          />
          {/* Near hills */}
          <path
            d="M0,220 Q400,140 800,200 Q1200,120 1600,190 Q2000,130 2400,210 Q2800,140 3200,200 Q3600,130 4000,190 Q4400,150 4800,210 Q5200,140 5600,200 L6000,220 L6000,300 L0,300 Z"
            fill="#6B9B5E"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Trees layer */}
      <div className="parallax-trees absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 6000 200"
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "25vh" }}
        >
          {/* Trees at intervals */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = i * 150 + Math.sin(i * 1.5) * 30;
            const h = 60 + Math.sin(i * 2.1) * 25;
            const shade = i % 3 === 0 ? "#4A7A3D" : i % 3 === 1 ? "#5B8A4E" : "#3D6B30";
            return (
              <g key={i}>
                {/* Trunk */}
                <rect
                  x={x + 8}
                  y={200 - h}
                  width="6"
                  height={h * 0.4}
                  fill="#8B6B4A"
                />
                {/* Canopy */}
                <ellipse
                  cx={x + 11}
                  cy={200 - h}
                  rx={14 + (i % 3) * 4}
                  ry={h * 0.45}
                  fill={shade}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}
