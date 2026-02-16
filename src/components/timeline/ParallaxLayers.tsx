"use client";

/* ───── Cloud shapes ───── */
function CloudSVG({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg className={className} style={style} width="220" height="70" viewBox="0 0 220 70">
      <ellipse cx="50"  cy="45" rx="50" ry="20" fill="white" />
      <ellipse cx="95"  cy="35" rx="55" ry="25" fill="white" />
      <ellipse cx="150" cy="42" rx="48" ry="20" fill="white" />
      <ellipse cx="120" cy="30" rx="35" ry="18" fill="white" />
      <ellipse cx="75"  cy="32" rx="30" ry="16" fill="white" />
    </svg>
  );
}

function SmallCloudSVG({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg className={className} style={style} width="120" height="45" viewBox="0 0 120 45">
      <ellipse cx="35" cy="28" rx="35" ry="14" fill="white" />
      <ellipse cx="65" cy="22" rx="30" ry="16" fill="white" />
      <ellipse cx="90" cy="27" rx="28" ry="13" fill="white" />
    </svg>
  );
}

/* ───── Tree generation ───── */
function generateTrees() {
  const trees: Array<{
    x: number;
    type: "deciduous" | "pine" | "bush";
    height: number;
    shade: string;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const x = i * 120 + Math.sin(i * 1.7) * 30;
    const type: "deciduous" | "pine" | "bush" =
      i % 5 === 0 ? "pine" : i % 4 === 0 ? "bush" : "deciduous";
    const height = 50 + Math.sin(i * 2.1) * 20;
    const shades = ["#4A7A3D", "#5B8A4E", "#3D6B30", "#6B9B5E", "#2E7D32"];
    trees.push({ x, type, height, shade: shades[i % shades.length] });
  }
  return trees;
}

const TREES = generateTrees();

export default function ParallaxLayers() {
  return (
    <>
      {/* Single, unified sky — warm romantic golden-hour atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #D6E8F5 0%, #E8D8C8 35%, #F2E0CC 60%, #F5E6D3 100%)",
        }}
      />

      {/* Subtle warm glow at horizon */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "18vh",
          height: "30vh",
          background:
            "linear-gradient(to top, rgba(245,198,131,0.18) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Clouds */}
      <div className="parallax-clouds absolute inset-0 overflow-visible">
        <CloudSVG
          style={{ position: "absolute", top: "6%",  left: "5%",   opacity: 0.5 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "12%", left: "18%",  opacity: 0.3 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "4%",  left: "35%",  opacity: 0.4 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "14%", left: "52%",  opacity: 0.3 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "7%",  left: "65%",  opacity: 0.35 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "3%",  left: "78%",  opacity: 0.25 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "10%", left: "88%",  opacity: 0.4 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "5%",  left: "95%",  opacity: 0.3 }}
        />
        <CloudSVG
          className="gentle-float"
          style={{ position: "absolute", top: "8%",  left: "110%", opacity: 0.3, animationDelay: "0.5s" }}
        />
        <SmallCloudSVG
          className="gentle-float"
          style={{ position: "absolute", top: "15%", left: "130%", opacity: 0.25, animationDelay: "1s" }}
        />
      </div>

      {/* Hills — 3 layers */}
      <div className="parallax-hills absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 6000 300"
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "35vh" }}
        >
          <path
            d="M0,220 Q200,160 500,200 Q800,140 1100,190 Q1400,120 1700,180 Q2000,140 2300,200 Q2600,100 2900,170 Q3200,130 3500,190 Q3800,80 4100,160 Q4400,120 4700,180 Q5000,140 5300,170 Q5600,130 5900,200 L6000,200 L6000,300 L0,300 Z"
            fill="#A8C8A0"
            opacity="0.35"
          />
          <path
            d="M0,240 Q300,160 600,210 Q900,130 1200,200 Q1500,110 1800,190 Q2100,140 2400,220 Q2700,120 3000,190 Q3300,140 3600,210 Q3900,100 4200,180 Q4500,130 4800,200 Q5100,150 5400,210 Q5700,140 6000,220 L6000,300 L0,300 Z"
            fill="#7BAF70"
            opacity="0.45"
          />
          <path
            d="M0,260 Q400,190 800,240 Q1200,170 1600,230 Q2000,180 2400,250 Q2800,190 3200,240 Q3600,180 4000,230 Q4400,200 4800,250 Q5200,190 5600,240 L6000,260 L6000,300 L0,300 Z"
            fill="#5E9455"
            opacity="0.55"
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
          {TREES.map((tree, i) => {
            if (tree.type === "pine") {
              return (
                <g key={i}>
                  <rect
                    x={tree.x + 6} y={200 - tree.height * 0.35}
                    width="4" height={tree.height * 0.35}
                    fill="#6B4E2A"
                  />
                  <polygon
                    points={`${tree.x + 8},${200 - tree.height} ${tree.x - 4},${200 - tree.height * 0.35} ${tree.x + 20},${200 - tree.height * 0.35}`}
                    fill={tree.shade}
                  />
                  <polygon
                    points={`${tree.x + 8},${200 - tree.height * 0.8} ${tree.x},${200 - tree.height * 0.2} ${tree.x + 16},${200 - tree.height * 0.2}`}
                    fill={tree.shade} opacity="0.8"
                  />
                </g>
              );
            } else if (tree.type === "bush") {
              return (
                <g key={i}>
                  <ellipse cx={tree.x + 8} cy={200 - tree.height * 0.3}
                    rx={12} ry={tree.height * 0.3} fill={tree.shade} />
                  <ellipse cx={tree.x + 14} cy={200 - tree.height * 0.25}
                    rx={10} ry={tree.height * 0.25} fill={tree.shade} opacity="0.8" />
                </g>
              );
            } else {
              return (
                <g key={i}>
                  <rect
                    x={tree.x + 8} y={200 - tree.height}
                    width="5" height={tree.height * 0.4}
                    fill="#8B6B4A"
                  />
                  <ellipse
                    cx={tree.x + 10} cy={200 - tree.height}
                    rx={14 + (i % 3) * 3} ry={tree.height * 0.42}
                    fill={tree.shade}
                  />
                  <ellipse
                    cx={tree.x + 14} cy={200 - tree.height * 0.95}
                    rx={10 + (i % 2) * 4} ry={tree.height * 0.3}
                    fill={tree.shade} opacity="0.7"
                  />
                </g>
              );
            }
          })}
        </svg>
      </div>
    </>
  );
}
