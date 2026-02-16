"use client";

/**
 * Per-chapter themed sky zones, detailed clouds, multi-layer hills,
 * varied tree shapes, and decorative per-chapter SVG elements.
 */

/* ───── Theme zone definitions ───── */
/*
 * Each zone is much wider than one screen, overlapping heavily with neighbors.
 * Combined with lower opacity and the crossfade divs, the colour shift feels
 * gradual rather than in-your-face.
 */
const THEME_ZONES = [
  {
    id: "school-start",
    label: "Morning",
    gradient: "linear-gradient(180deg, #FFF8E7 0%, #FFE4B5 100%)",
    left: "-10vw",
    width: "160vw",
    opacity: 1,
  },
  {
    id: "ch1",
    label: "Warm Gold",
    gradient: "linear-gradient(180deg, #FFF8E7 0%, #FFE4B5 40%, #F5DEB3 100%)",
    left: "60vw",
    width: "160vw",
    opacity: 0.7,
  },
  {
    id: "ch2",
    label: "Bright Blue",
    gradient: "linear-gradient(180deg, #EDF5FD 0%, #D6EAFB 40%, #B8D8F8 100%)",
    left: "160vw",
    width: "160vw",
    opacity: 0.6,
  },
  {
    id: "ch3",
    label: "Golden Sunset",
    gradient: "linear-gradient(180deg, #FFF6EC 0%, #FFE8CC 40%, #FFDDB0 100%)",
    left: "260vw",
    width: "160vw",
    opacity: 0.6,
  },
  {
    id: "ch4",
    label: "Overcast/Dusky",
    gradient: "linear-gradient(180deg, #F0F2F4 0%, #DDE1E5 40%, #C8CDD2 100%)",
    left: "340vw",
    width: "160vw",
    opacity: 0.65,
  },
  {
    id: "ch5",
    label: "Starry Night",
    gradient: "linear-gradient(180deg, #1A237E 0%, #283593 40%, #3949AB 100%)",
    left: "420vw",
    width: "160vw",
    opacity: 0.85,
  },
  {
    id: "ch6",
    label: "Radiant Sunrise",
    gradient: "linear-gradient(180deg, #FFFAEB 0%, #FFE8A8 40%, #FFDD78 100%)",
    left: "510vw",
    width: "160vw",
    opacity: 0.7,
  },
];

/* ───── Cloud shapes ───── */
function CloudSVG({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg className={className} style={style} width="220" height="70" viewBox="0 0 220 70">
      <ellipse cx="50" cy="45" rx="50" ry="20" fill="white" />
      <ellipse cx="95" cy="35" rx="55" ry="25" fill="white" />
      <ellipse cx="150" cy="42" rx="48" ry="20" fill="white" />
      <ellipse cx="120" cy="30" rx="35" ry="18" fill="white" />
      <ellipse cx="75" cy="32" rx="30" ry="16" fill="white" />
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

/* ───── Star for Ch5 ───── */
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill="white"
      className="twinkle"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

/* ───── Decorative elements per chapter ───── */
function ChapterDecorations() {
  return (
    <>
      {/* Ch3 - subtle hearts */}
      <svg
        className="absolute gentle-float"
        style={{
          left: "310vw",
          top: "10%",
          opacity: 0.15,
          contentVisibility: "auto",
        }}
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        <path
          d="M20,35 L5,20 A8,8 0 0,1 20,10 A8,8 0 0,1 35,20 Z"
          fill="#E57373"
        />
      </svg>
      <svg
        className="absolute gentle-float"
        style={{
          left: "340vw",
          top: "18%",
          opacity: 0.1,
          animationDelay: "1.5s",
          contentVisibility: "auto",
        }}
        width="28"
        height="28"
        viewBox="0 0 40 40"
      >
        <path
          d="M20,35 L5,20 A8,8 0 0,1 20,10 A8,8 0 0,1 35,20 Z"
          fill="#E57373"
        />
      </svg>

      {/* Ch5 - stars */}
      <svg
        className="absolute"
        style={{
          left: "450vw",
          top: 0,
          width: "110vw",
          height: "60%",
          contentVisibility: "auto",
        }}
        viewBox="0 0 1100 400"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Star
            key={i}
            x={30 + (i * 271) % 1050}
            y={10 + (i * 137) % 360}
            size={0.8 + (i % 4) * 0.5}
            delay={(i * 0.37) % 3}
          />
        ))}
      </svg>

      {/* Ch5 - location pins & arc */}
      <svg
        className="absolute"
        style={{
          left: "462vw",
          top: "15%",
          width: "80vw",
          height: "30vh",
          contentVisibility: "auto",
        }}
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Dotted arc connecting pins */}
        <path
          d="M120,200 Q400,20 680,200"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        {/* India pin */}
        <g>
          <path
            d="M120,200 C120,175 100,155 100,140 A20,20 0 1,1 140,140 C140,155 120,175 120,200 Z"
            fill="#EF5350"
            opacity="0.85"
          />
          <circle cx="120" cy="138" r="7" fill="white" opacity="0.8" />
          <text x="120" y="230" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.7)" fontWeight="bold">India</text>
        </g>
        {/* Germany pin */}
        <g>
          <path
            d="M680,200 C680,175 660,155 660,140 A20,20 0 1,1 700,140 C700,155 680,175 680,200 Z"
            fill="#42A5F5"
            opacity="0.85"
          />
          <circle cx="680" cy="138" r="7" fill="white" opacity="0.8" />
          <text x="680" y="230" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.7)" fontWeight="bold">Germany</text>
        </g>
      </svg>

      {/* Ch6 - confetti / celebration dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={`confetti-${i}`}
          className="absolute gentle-float"
          style={{
            left: `${545 + i * 8}vw`,
            top: `${8 + (i * 7) % 20}%`,
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: ["#C9A96E", "#E57373", "#81C784", "#FFD54F", "#90CAF9", "#CE93D8"][i],
            opacity: 0.35,
            animationDelay: `${i * 0.5}s`,
            contentVisibility: "auto",
          }}
        />
      ))}
    </>
  );
}

/* ───── Hill colors per zone ───── */
const HILL_THEMES = [
  { far: "#A8D5A2", near: "#7CB668" }, // school/ch1 warm morning
  { far: "#A8D5A2", near: "#7CB668" }, // ch1
  { far: "#8DC5E6", near: "#6BA8CF" }, // ch2 bright blue tint
  { far: "#D4B896", near: "#C4A078" }, // ch3 golden
  { far: "#9E9E9E", near: "#808080" }, // ch4 overcast
  { far: "#3949AB", near: "#303F9F" }, // ch5 night (match sky)
  { far: "#C5E1A5", near: "#9CCC65" }, // ch6 fresh green
];

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
    const sectionIdx = Math.floor(x / 857); // ~6000/7 zones

    // Thin out trees for ch4-ch5 (zones 4-5)
    if (sectionIdx >= 4 && sectionIdx <= 5 && i % 3 !== 0) continue;

    const type: "deciduous" | "pine" | "bush" =
      i % 5 === 0 ? "pine" : i % 4 === 0 ? "bush" : "deciduous";
    const height = 50 + Math.sin(i * 2.1) * 20;
    const shades = ["#4A7A3D", "#5B8A4E", "#3D6B30", "#6B9B5E", "#2E7D32"];
    const shade = shades[i % shades.length];

    trees.push({ x, type, height, shade });
  }
  return trees;
}

const TREES = generateTrees();

export default function ParallaxLayers() {
  return (
    <>
      {/* Themed sky zones — wide and semi-transparent for gentle blending */}
      {THEME_ZONES.map((zone) => (
        <div
          key={zone.id}
          className="absolute inset-y-0"
          style={{
            left: zone.left,
            width: zone.width,
            background: zone.gradient,
            opacity: zone.opacity,
            contentVisibility: "auto",
          }}
        />
      ))}

      {/* Wide crossfade overlaps between zones for smooth transitions */}
      {THEME_ZONES.slice(0, -1).map((zone, i) => (
        <div
          key={`fade-${zone.id}`}
          className="absolute inset-y-0"
          style={{
            left: `calc(${THEME_ZONES[i + 1].left} - 30vw)`,
            width: "60vw",
            background: `linear-gradient(to right, transparent, ${
              THEME_ZONES[i + 1].gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? "transparent"
            })`,
            opacity: 0.35,
            contentVisibility: "auto",
          }}
        />
      ))}

      {/* Clouds */}
      <div className="parallax-clouds absolute inset-0 overflow-visible">
        <CloudSVG
          style={{ position: "absolute", top: "6%", left: "5%", opacity: 0.4 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "12%", left: "18%", opacity: 0.25 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "4%", left: "35%", opacity: 0.35 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "14%", left: "52%", opacity: 0.3 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "7%", left: "65%", opacity: 0.3 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "3%", left: "78%", opacity: 0.2 }}
        />
        <CloudSVG
          style={{ position: "absolute", top: "10%", left: "88%", opacity: 0.35 }}
        />
        <SmallCloudSVG
          style={{ position: "absolute", top: "5%", left: "95%", opacity: 0.25 }}
        />
        {/* Extra clouds for 600vw wide track - positioned beyond 100% */}
        <CloudSVG
          className="gentle-float"
          style={{ position: "absolute", top: "8%", left: "110%", opacity: 0.3, animationDelay: "0.5s" }}
        />
        <SmallCloudSVG
          className="gentle-float"
          style={{ position: "absolute", top: "15%", left: "130%", opacity: 0.25, animationDelay: "1s" }}
        />
      </div>

      {/* Hills - 3 layers */}
      <div className="parallax-hills absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 6000 300"
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "35vh" }}
        >
          {/* Distant hills (lightest, most gentle) */}
          <path
            d="M0,220 Q200,160 500,200 Q800,140 1100,190 Q1400,120 1700,180 Q2000,140 2300,200 Q2600,100 2900,170 Q3200,130 3500,190 Q3800,80 4100,160 Q4400,120 4700,180 Q5000,140 5300,170 Q5600,130 5900,200 L6000,200 L6000,300 L0,300 Z"
            fill="#8DB580"
            opacity="0.35"
          />
          {/* Mid hills */}
          <path
            d="M0,240 Q300,160 600,210 Q900,130 1200,200 Q1500,110 1800,190 Q2100,140 2400,220 Q2700,120 3000,190 Q3300,140 3600,210 Q3900,100 4200,180 Q4500,130 4800,200 Q5100,150 5400,210 Q5700,140 6000,220 L6000,300 L0,300 Z"
            fill="#6B9B5E"
            opacity="0.45"
          />
          {/* Near hills (darkest) */}
          <path
            d="M0,260 Q400,190 800,240 Q1200,170 1600,230 Q2000,180 2400,250 Q2800,190 3200,240 Q3600,180 4000,230 Q4400,200 4800,250 Q5200,190 5600,240 L6000,260 L6000,300 L0,300 Z"
            fill="#5A8A4E"
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
              // Pine tree: triangular
              return (
                <g key={i}>
                  <rect
                    x={tree.x + 6}
                    y={200 - tree.height * 0.35}
                    width="4"
                    height={tree.height * 0.35}
                    fill="#6B4E2A"
                  />
                  <polygon
                    points={`${tree.x + 8},${200 - tree.height} ${tree.x - 4},${200 - tree.height * 0.35} ${tree.x + 20},${200 - tree.height * 0.35}`}
                    fill={tree.shade}
                  />
                  <polygon
                    points={`${tree.x + 8},${200 - tree.height * 0.8} ${tree.x},${200 - tree.height * 0.2} ${tree.x + 16},${200 - tree.height * 0.2}`}
                    fill={tree.shade}
                    opacity="0.8"
                  />
                </g>
              );
            } else if (tree.type === "bush") {
              // Bush: small rounded
              return (
                <g key={i}>
                  <ellipse
                    cx={tree.x + 8}
                    cy={200 - tree.height * 0.3}
                    rx={12}
                    ry={tree.height * 0.3}
                    fill={tree.shade}
                  />
                  <ellipse
                    cx={tree.x + 14}
                    cy={200 - tree.height * 0.25}
                    rx={10}
                    ry={tree.height * 0.25}
                    fill={tree.shade}
                    opacity="0.8"
                  />
                </g>
              );
            } else {
              // Deciduous: trunk + round canopy
              return (
                <g key={i}>
                  <rect
                    x={tree.x + 8}
                    y={200 - tree.height}
                    width="5"
                    height={tree.height * 0.4}
                    fill="#8B6B4A"
                  />
                  <ellipse
                    cx={tree.x + 10}
                    cy={200 - tree.height}
                    rx={14 + (i % 3) * 3}
                    ry={tree.height * 0.42}
                    fill={tree.shade}
                  />
                  <ellipse
                    cx={tree.x + 14}
                    cy={200 - tree.height * 0.95}
                    rx={10 + (i % 2) * 4}
                    ry={tree.height * 0.3}
                    fill={tree.shade}
                    opacity="0.7"
                  />
                </g>
              );
            }
          })}
        </svg>
      </div>

      {/* Per-chapter decorative elements */}
      <ChapterDecorations />
    </>
  );
}
