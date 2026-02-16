"use client";

import React from "react";

/* ───── Shared elements across the full track ───── */

function LampPosts() {
  const posts = Array.from({ length: 20 }, (_, i) => i * 300 + 150);
  return (
    <g>
      {posts.map((x, i) => (
        <g key={`lamp-${i}`}>
          {/* Pole */}
          <rect x={x} y={180} width={4} height={120} fill="#6B6B6B" rx={1} />
          {/* Arm */}
          <path
            d={`M${x + 2},190 Q${x + 20},185 ${x + 22},195`}
            stroke="#6B6B6B"
            strokeWidth={3}
            fill="none"
          />
          {/* Lantern housing */}
          <rect x={x + 16} y={192} width={12} height={10} fill="#555" rx={2} />
          {/* Glow */}
          <ellipse
            cx={x + 22}
            cy={210}
            rx={14}
            ry={18}
            fill="#FFF7CC"
            opacity={0.15}
          />
          {/* Bulb */}
          <circle cx={x + 22} cy={202} r={3} fill="#FFE680" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

function Wildflowers() {
  // Scatter wildflowers in gaps between chapter zones
  const gapRanges = [
    [0, 200],
    [1200, 1200],
    [2200, 2200],
    [3200, 3200],
    [4000, 4000],
    [4800, 4800],
  ];
  const colors = ["#E8475F", "#FFD54F", "#AB47BC", "#42A5F5", "#FF8A65", "#66BB6A"];
  const flowers: React.ReactElement[] = [];

  for (let x = 0; x < 6000; x += 80) {
    // Skip chapter zones
    const inChapter =
      (x >= 200 && x <= 1200) ||
      (x >= 1200 && x <= 2200) ||
      (x >= 2200 && x <= 3200) ||
      (x >= 3200 && x <= 4000) ||
      (x >= 4000 && x <= 4800) ||
      (x >= 4800 && x <= 5800);
    if (inChapter) continue;

    const y = 310 + Math.sin(x * 0.03) * 15;
    const color = colors[Math.floor(x / 80) % colors.length];
    flowers.push(
      <g key={`wf-${x}`}>
        <circle cx={x} cy={y} r={3} fill={color} opacity={0.7} />
        <circle cx={x + 8} cy={y - 4} r={2.5} fill={colors[(Math.floor(x / 80) + 2) % colors.length]} opacity={0.6} />
        <line x1={x} y1={y + 3} x2={x} y2={y + 14} stroke="#5B8A4E" strokeWidth={1} />
        <line x1={x + 8} y1={y - 1} x2={x + 8} y2={y + 12} stroke="#5B8A4E" strokeWidth={1} />
      </g>
    );
  }
  return <g>{flowers}</g>;
}

function PicketFences() {
  // Low fence rails in gaps: before ch1, between chapters
  const segments = [
    [30, 180],
    [5850, 5980],
  ];
  const fences: React.ReactElement[] = [];
  segments.forEach(([start, end], si) => {
    for (let x = start; x < end; x += 20) {
      fences.push(
        <g key={`fence-${si}-${x}`}>
          <rect x={x} y={290} width={3} height={20} fill="#D4C4A8" rx={1} />
          <rect x={x} y={292} width={20} height={2.5} fill="#D4C4A8" rx={0.5} />
          <rect x={x} y={302} width={20} height={2.5} fill="#D4C4A8" rx={0.5} />
        </g>
      );
    }
  });
  return <g>{fences}</g>;
}

function Milestones() {
  const positions = [1000, 2000, 3000, 4000, 5000];
  return (
    <g>
      {positions.map((x, i) => (
        <g key={`ms-${i}`}>
          <rect x={x} y={310} width={14} height={22} fill="#C8BFA8" rx={2} />
          <rect x={x + 1} y={312} width={12} height={4} fill="#A89880" rx={1} />
          <text x={x + 7} y={327} fontSize={7} fill="#7A6B5A" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

/* ───── Chapter-themed zones ───── */

function ChapterSchool() {
  // X: 200–1200 — School theme
  return (
    <g>
      {/* School gate arch */}
      <rect x={350} y={240} width={8} height={80} fill="#8B4513" />
      <rect x={500} y={240} width={8} height={80} fill="#8B4513" />
      <path
        d="M350,240 Q429,200 508,240"
        stroke="#8B4513"
        strokeWidth={6}
        fill="none"
      />
      <text x={429} y={232} fontSize={12} fill="#5D3A1A" textAnchor="middle" fontWeight="bold">
        SCHOOL
      </text>

      {/* Flagpole with pennant */}
      <rect x={300} y={210} width={3} height={110} fill="#888" />
      <polygon points="303,212 340,222 303,232" fill="#E53935" opacity={0.85} />

      {/* Playground swing set */}
      <line x1={600} y1={260} x2={620} y2={320} stroke="#777" strokeWidth={3} />
      <line x1={700} y1={260} x2={680} y2={320} stroke="#777" strokeWidth={3} />
      <line x1={595} y1={260} x2={705} y2={260} stroke="#777" strokeWidth={4} />
      {/* Swing chains + seat */}
      <line x1={635} y1={260} x2={630} y2={305} stroke="#666" strokeWidth={1.5} />
      <line x1={665} y1={260} x2={670} y2={305} stroke="#666" strokeWidth={1.5} />
      <rect x={625} y={305} width={50} height={5} fill="#5D4037" rx={1} />

      {/* Hopscotch on ground */}
      {[0, 1, 2, 3, 4].map((n) => (
        <rect
          key={`hop-${n}`}
          x={800 + n * 28}
          y={330}
          width={24}
          height={30}
          fill="none"
          stroke="#FFE082"
          strokeWidth={2}
          rx={2}
          opacity={0.6}
        />
      ))}
      <text x={828} y={350} fontSize={10} fill="#FFE082" opacity={0.5}>1</text>
      <text x={856} y={350} fontSize={10} fill="#FFE082" opacity={0.5}>2</text>
      <text x={884} y={350} fontSize={10} fill="#FFE082" opacity={0.5}>3</text>

      {/* Chalk drawings */}
      <circle cx={1050} cy={340} r={12} fill="none" stroke="#FF80AB" strokeWidth={2} opacity={0.4} />
      <polygon points="1100,325 1108,345 1092,345" fill="none" stroke="#80D8FF" strokeWidth={2} opacity={0.4} />
      <rect x={1130} y={330} width={18} height={18} fill="none" stroke="#FFE082" strokeWidth={2} opacity={0.4} rx={1} />
    </g>
  );
}

function ChapterNeighborhood() {
  // X: 1200–2200 — Neighborhood
  return (
    <g>
      {/* House 1 */}
      <rect x={1300} y={270} width={70} height={55} fill="#FFCCBC" rx={2} />
      <polygon points="1295,270 1335,235 1375,270" fill="#D84315" opacity={0.7} />
      <rect x={1315} y={290} width={12} height={12} fill="#81D4FA" opacity={0.6} />
      <rect x={1342} y={290} width={12} height={12} fill="#81D4FA" opacity={0.6} />
      <rect x={1325} y={305} width={14} height={20} fill="#8D6E63" rx={1} />

      {/* House 2 */}
      <rect x={1500} y={260} width={80} height={65} fill="#C8E6C9" rx={2} />
      <polygon points="1493,260 1540,220 1587,260" fill="#4CAF50" opacity={0.5} />
      <rect x={1515} y={278} width={14} height={14} fill="#FFF9C4" opacity={0.5} />
      <rect x={1545} y={278} width={14} height={14} fill="#FFF9C4" opacity={0.5} />
      <rect x={1530} y={300} width={16} height={25} fill="#795548" rx={1} />

      {/* House 3 */}
      <rect x={1700} y={275} width={60} height={50} fill="#E1BEE7" rx={2} />
      <polygon points="1695,275 1730,245 1765,275" fill="#7B1FA2" opacity={0.4} />
      <rect x={1712} y={290} width={10} height={10} fill="#BBDEFB" opacity={0.5} />
      <rect x={1738} y={290} width={10} height={10} fill="#BBDEFB" opacity={0.5} />

      {/* Bus stop shelter */}
      <rect x={1870} y={280} width={50} height={4} fill="#78909C" rx={1} />
      <rect x={1873} y={284} width={4} height={36} fill="#78909C" />
      <rect x={1913} y={284} width={4} height={36} fill="#78909C" />
      <rect x={1875} y={290} width={42} height={22} fill="#B0BEC5" opacity={0.3} rx={1} />
      <text x={1896} y={304} fontSize={6} fill="#546E7A" textAnchor="middle">BUS</text>

      {/* Mailbox */}
      <rect x={1430} y={300} width={12} height={15} fill="#1565C0" rx={2} />
      <rect x={1433} y={315} width={6} height={10} fill="#5D4037" />

      {/* Potted plants */}
      <rect x={1280} y={318} width={10} height={8} fill="#8D6E63" rx={1} />
      <ellipse cx={1285} cy={314} rx={8} ry={6} fill="#66BB6A" />
      <rect x={1600} y={318} width={10} height={8} fill="#8D6E63" rx={1} />
      <ellipse cx={1605} cy={314} rx={7} ry={5} fill="#4CAF50" />

      {/* Picket fence segment */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`pf-${i}`}>
          <rect x={1640 + i * 12} y={305} width={3} height={18} fill="#F5F0E6" rx={0.5} />
        </g>
      ))}
      <rect x={1640} y={308} width={96} height={2} fill="#F5F0E6" />
      <rect x={1640} y={316} width={96} height={2} fill="#F5F0E6" />
    </g>
  );
}

function ChapterRomance() {
  // X: 2200–3200 — Romance / Park
  return (
    <g>
      {/* Park bench */}
      <rect x={2350} y={310} width={60} height={4} fill="#6D4C41" rx={1} />
      <rect x={2355} y={300} width={4} height={10} fill="#6D4C41" />
      <rect x={2401} y={300} width={4} height={10} fill="#6D4C41" />
      <rect x={2350} y={298} width={60} height={4} fill="#5D4037" rx={1} />
      <rect x={2358} y={314} width={4} height={12} fill="#4E342E" />
      <rect x={2398} y={314} width={4} height={12} fill="#4E342E" />

      {/* Flower garden beds */}
      {[2500, 2530, 2560, 2590, 2620].map((fx, i) => {
        const colors = ["#E91E63", "#FF5722", "#FFC107", "#E91E63", "#FF9800"];
        return (
          <g key={`fg-${i}`}>
            <ellipse cx={fx} cy={330} rx={10} ry={6} fill={colors[i]} opacity={0.6} />
            <ellipse cx={fx + 5} cy={327} rx={7} ry={5} fill={colors[(i + 2) % 5]} opacity={0.5} />
            <line x1={fx} y1={336} x2={fx} y2={350} stroke="#4CAF50" strokeWidth={1} />
          </g>
        );
      })}

      {/* Gazebo/bandstand */}
      <polygon points="2750,240 2710,270 2790,270" fill="#D7CCC8" opacity={0.7} />
      <rect x={2715} y={270} width={70} height={4} fill="#BCAAA4" />
      <rect x={2720} y={274} width={4} height={46} fill="#A1887F" />
      <rect x={2776} y={274} width={4} height={46} fill="#A1887F" />
      <rect x={2748} y={250} width={4} height={20} fill="#A1887F" />
      {/* Gazebo railing */}
      <rect x={2724} y={300} width={52} height={3} fill="#BCAAA4" rx={1} />

      {/* Butterflies */}
      {[
        [2450, 260],
        [2680, 250],
        [2850, 270],
      ].map(([bx, by], i) => (
        <g key={`bfly-${i}`} opacity={0.6}>
          <ellipse cx={bx - 5} cy={by} rx={6} ry={4} fill="#CE93D8" transform={`rotate(-20 ${bx - 5} ${by})`} />
          <ellipse cx={bx + 5} cy={by} rx={6} ry={4} fill="#CE93D8" transform={`rotate(20 ${bx + 5} ${by})`} />
          <rect x={bx - 0.5} y={by - 2} width={1} height={5} fill="#6A1B9A" />
        </g>
      ))}

      {/* Heart carved on tree */}
      <rect x={2900} y={260} width={12} height={50} fill="#6D4C41" rx={3} />
      <ellipse cx={2906} cy={260} rx={18} ry={22} fill="#4CAF50" opacity={0.7} />
      <path
        d="M2900,278 Q2898,273 2902,272 Q2906,268 2910,273 Q2914,272 2912,278 L2906,286 Z"
        fill="none"
        stroke="#FFCDD2"
        strokeWidth={1.5}
        opacity={0.7}
      />

      {/* Fairy lights string */}
      <path
        d="M2300,265 Q2400,255 2500,265 Q2600,255 2700,265"
        stroke="#333"
        strokeWidth={0.8}
        fill="none"
        opacity={0.3}
      />
      {[2320, 2360, 2400, 2440, 2480, 2520, 2560, 2600, 2640, 2680].map((lx, i) => (
        <circle key={`fl-${i}`} cx={lx} cy={260 + Math.sin(lx * 0.02) * 4} r={2.5} fill="#FFF9C4" opacity={0.6} />
      ))}
    </g>
  );
}

function ChapterCity() {
  // X: 3200–4000 — City / Growth
  return (
    <g>
      {/* Tall buildings */}
      <rect x={3300} y={200} width={50} height={125} fill="#607D8B" opacity={0.6} rx={2} />
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`bw1-${r}-${c}`}
            x={3308 + c * 14}
            y={210 + r * 18}
            width={8}
            height={10}
            fill="#FFF9C4"
            opacity={r % 2 === c % 2 ? 0.6 : 0.2}
            rx={1}
          />
        ))
      )}

      <rect x={3400} y={230} width={60} height={95} fill="#78909C" opacity={0.55} rx={2} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`bw2-${r}-${c}`}
            x={3406 + c * 13}
            y={238 + r * 20}
            width={7}
            height={12}
            fill="#FFF9C4"
            opacity={(r + c) % 3 === 0 ? 0.5 : 0.15}
            rx={1}
          />
        ))
      )}

      <rect x={3520} y={240} width={45} height={85} fill="#546E7A" opacity={0.5} rx={2} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`bw3-${r}-${c}`}
            x={3528 + c * 18}
            y={250 + r * 18}
            width={10}
            height={10}
            fill="#FFF9C4"
            opacity={r % 2 === 0 ? 0.4 : 0.15}
            rx={1}
          />
        ))
      )}

      {/* Bridge/overpass */}
      <path
        d="M3620,310 Q3660,280 3700,310"
        stroke="#90A4AE"
        strokeWidth={6}
        fill="none"
      />
      <rect x={3618} y={308} width={4} height={18} fill="#78909C" />
      <rect x={3698} y={308} width={4} height={18} fill="#78909C" />
      {/* Bridge railing */}
      <path
        d="M3622,305 Q3660,278 3698,305"
        stroke="#B0BEC5"
        strokeWidth={1.5}
        fill="none"
      />

      {/* Direction signpost */}
      <rect x={3780} y={270} width={4} height={56} fill="#6D4C41" />
      <polygon points="3784,275 3830,280 3830,290 3784,295" fill="#FFF9C4" />
      <text x={3800} y={287} fontSize={7} fill="#5D4037">CITY</text>
      <polygon points="3780,300 3740,305 3740,315 3780,320" fill="#C8E6C9" />
      <text x={3758} y={313} fontSize={6} fill="#2E7D32">PARK</text>

      {/* Coffee shop awning */}
      <rect x={3860} y={290} width={70} height={35} fill="#EFEBE9" rx={2} />
      <path
        d="M3855,290 Q3870,280 3885,290 Q3900,280 3915,290 Q3930,280 3940,290"
        fill="#D84315"
        opacity={0.5}
      />
      <text x={3895} y={312} fontSize={7} fill="#5D4037" textAnchor="middle">CAFE</text>
      <rect x={3885} y={315} width={12} height={10} fill="#8D6E63" rx={1} />
    </g>
  );
}

function ChapterIntimacy() {
  // X: 4000–4800 — Intimacy / Quiet
  return (
    <g>
      {/* Paper lanterns string */}
      <path
        d="M4050,255 Q4150,240 4250,255 Q4350,240 4450,255"
        stroke="#555"
        strokeWidth={0.8}
        fill="none"
        opacity={0.3}
      />
      {[4080, 4130, 4180, 4230, 4280, 4330, 4380, 4430].map((lx, i) => {
        const colors = ["#FFCC80", "#EF9A9A", "#CE93D8", "#A5D6A7"];
        return (
          <g key={`pl-${i}`}>
            <ellipse
              cx={lx}
              cy={250 + Math.sin(lx * 0.015) * 5}
              rx={7}
              ry={9}
              fill={colors[i % 4]}
              opacity={0.5}
            />
            <line
              x1={lx}
              y1={243 + Math.sin(lx * 0.015) * 5}
              x2={lx}
              y2={248 + Math.sin(lx * 0.015) * 5}
              stroke="#555"
              strokeWidth={0.5}
            />
          </g>
        );
      })}

      {/* Stone arch bridge */}
      <path
        d="M4200,325 Q4240,290 4280,325"
        stroke="#9E9E9E"
        strokeWidth={8}
        fill="none"
      />
      <path
        d="M4200,325 Q4240,295 4280,325"
        stroke="#BDBDBD"
        strokeWidth={3}
        fill="none"
      />
      {/* Bridge stones */}
      {[4210, 4225, 4240, 4255, 4270].map((sx, i) => (
        <rect
          key={`bs-${i}`}
          x={sx}
          y={310 - Math.sin((sx - 4200) * 0.04) * 20}
          width={10}
          height={5}
          fill="#BDBDBD"
          opacity={0.3}
          rx={1}
        />
      ))}

      {/* Stepping stones */}
      {[4500, 4530, 4555, 4585].map((sx, i) => (
        <ellipse
          key={`step-${i}`}
          cx={sx}
          cy={340 + (i % 2) * 5}
          rx={10}
          ry={5}
          fill="#B0BEC5"
          opacity={0.4}
        />
      ))}

      {/* Quiet wooden bench */}
      <rect x={4620} y={310} width={50} height={3.5} fill="#8D6E63" rx={1} />
      <rect x={4625} y={302} width={3} height={8} fill="#6D4C41" />
      <rect x={4662} y={302} width={3} height={8} fill="#6D4C41" />
      <rect x={4620} y={300} width={50} height={3.5} fill="#795548" rx={1} />
      <rect x={4628} y={313.5} width={3} height={10} fill="#5D4037" />
      <rect x={4659} y={313.5} width={3} height={10} fill="#5D4037" />

      {/* Firefly dots */}
      {[
        [4100, 290], [4160, 275], [4300, 280], [4380, 295],
        [4500, 270], [4580, 285], [4650, 275], [4720, 290],
        [4140, 300], [4420, 265], [4550, 295], [4690, 280],
      ].map(([fx, fy], i) => (
        <circle
          key={`ff-${i}`}
          cx={fx}
          cy={fy}
          r={1.8}
          fill="#FFEE58"
          opacity={0.3 + (i % 3) * 0.15}
        />
      ))}
    </g>
  );
}

function ChapterWedding() {
  // X: 4800–5800 — Wedding
  return (
    <g>
      {/* Flower arch / mandap frame */}
      <rect x={4950} y={220} width={6} height={110} fill="#8D6E63" rx={1} />
      <rect x={5100} y={220} width={6} height={110} fill="#8D6E63" rx={1} />
      <path
        d="M4950,225 Q5028,180 5106,225"
        stroke="#8D6E63"
        strokeWidth={6}
        fill="none"
      />
      {/* Flowers on the arch */}
      {[4960, 4980, 5000, 5020, 5040, 5060, 5080, 5096].map((fx, i) => {
        const colors = ["#FF7043", "#FFA726", "#FFD54F", "#FF7043", "#FFA726", "#FFD54F", "#FF7043", "#FFA726"];
        const arcY = 225 - Math.sin(((fx - 4950) / 156) * Math.PI) * 42;
        return (
          <circle key={`af-${i}`} cx={fx} cy={arcY} r={5} fill={colors[i]} opacity={0.7} />
        );
      })}

      {/* Marigold garlands */}
      {[0, 1, 2].map((gi) => (
        <g key={`garland-${gi}`}>
          <path
            d={`M${4850 + gi * 150},260 Q${4875 + gi * 150},275 ${4900 + gi * 150},260`}
            stroke="#FFA726"
            strokeWidth={4}
            fill="none"
            opacity={0.5}
          />
          {[0, 1, 2, 3, 4].map((fi) => (
            <circle
              key={`gf-${gi}-${fi}`}
              cx={4855 + gi * 150 + fi * 11}
              cy={262 + Math.sin(fi * 0.8) * 8}
              r={3}
              fill={fi % 2 === 0 ? "#FFA726" : "#FFD54F"}
              opacity={0.6}
            />
          ))}
        </g>
      ))}

      {/* String lights */}
      <path
        d="M4830,250 Q4930,238 5030,250 Q5130,238 5230,250 Q5330,238 5430,250"
        stroke="#444"
        strokeWidth={0.6}
        fill="none"
        opacity={0.3}
      />
      {Array.from({ length: 20 }, (_, i) => 4840 + i * 32).map((lx, i) => (
        <circle
          key={`sl-${i}`}
          cx={lx}
          cy={246 + Math.sin(lx * 0.01) * 3}
          r={2}
          fill={i % 3 === 0 ? "#FFF9C4" : i % 3 === 1 ? "#FFCC80" : "#FFE0B2"}
          opacity={0.7}
        />
      ))}

      {/* Rangoli pattern on ground */}
      <circle cx={5300} cy={345} r={20} fill="none" stroke="#E91E63" strokeWidth={1.5} opacity={0.35} />
      <circle cx={5300} cy={345} r={13} fill="none" stroke="#FF9800" strokeWidth={1.5} opacity={0.35} />
      <circle cx={5300} cy={345} r={6} fill="#FFC107" opacity={0.25} />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={`rng-${i}`}
            cx={5300 + Math.cos(rad) * 17}
            cy={345 + Math.sin(rad) * 17}
            r={3}
            fill={i % 2 === 0 ? "#E91E63" : "#FF9800"}
            opacity={0.3}
          />
        );
      })}

      {/* Bunting flags */}
      <line x1={5450} y1={265} x2={5700} y2={265} stroke="#555" strokeWidth={0.8} opacity={0.3} />
      {Array.from({ length: 10 }, (_, i) => 5460 + i * 25).map((bx, i) => {
        const bColors = ["#E91E63", "#FF9800", "#4CAF50", "#2196F3", "#9C27B0"];
        return (
          <polygon
            key={`bunt-${i}`}
            points={`${bx},265 ${bx + 8},265 ${bx + 4},280`}
            fill={bColors[i % 5]}
            opacity={0.45}
          />
        );
      })}

      {/* Welcome sign */}
      <rect x={5600} y={280} width={80} height={30} fill="#FFF8E1" rx={4} />
      <rect x={5600} y={280} width={80} height={30} fill="none" stroke="#D4A056" strokeWidth={1.5} rx={4} />
      <text x={5640} y={300} fontSize={9} fill="#6D4C41" textAnchor="middle" fontWeight="bold">
        Welcome
      </text>
      <rect x={5636} y={310} width={8} height={16} fill="#8D6E63" />
    </g>
  );
}

/* ───── Main Component ───── */

export default function RoadsideScenery() {
  return (
    <div
      className="absolute left-0 w-full pointer-events-none"
      style={{
        bottom: "11vh",
        height: "24vh",
        zIndex: 10,
      }}
    >
      <svg
        viewBox="0 0 6000 400"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Shared elements */}
        <LampPosts />
        <Wildflowers />
        <PicketFences />
        <Milestones />

        {/* Per-chapter themed zones */}
        <ChapterSchool />
        <ChapterNeighborhood />
        <ChapterRomance />
        <ChapterCity />
        <ChapterIntimacy />
        <ChapterWedding />
      </svg>
    </div>
  );
}
