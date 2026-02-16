"use client";

export default function BusRoad() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full"
      style={{
        height: "18vh",
      }}
    >
      {/* Textured ground with earthy gradient */}
      <div
        className="absolute bottom-0 left-0 h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, #B8976A 0%, #C4A77D 30%, #D4B88C 60%, #CAAA78 100%)",
        }}
      />

      {/* Wavy grass edge + stone curb + road surface */}
      <svg
        viewBox="0 0 6000 300"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: "18vh" }}
      >
        <defs>
          {/* Asphalt gradient */}
          <linearGradient id="asphalt-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="25%" stopColor="#555555" />
            <stop offset="50%" stopColor="#515151" />
            <stop offset="75%" stopColor="#4D4D4D" />
            <stop offset="100%" stopColor="#484848" />
          </linearGradient>
          {/* Earthy ground gradient */}
          <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8976A" />
            <stop offset="40%" stopColor="#C4A77D" />
            <stop offset="70%" stopColor="#D4B88C" />
            <stop offset="100%" stopColor="#CAAA78" />
          </linearGradient>
        </defs>

        {/* Ground fill */}
        <rect x="0" y="0" width="6000" height="300" fill="url(#ground-grad)" />

        {/* Scattered pebble dots on ground */}
        {Array.from({ length: 120 }).map((_, i) => {
          const px = i * 50 + ((i * 37) % 30);
          const py = 20 + ((i * 53) % 60);
          const r = 1.5 + (i % 3) * 0.5;
          return (
            <circle
              key={`peb-${i}`}
              cx={px}
              cy={py}
              r={r}
              fill={i % 2 === 0 ? "#A08B6A" : "#BCA882"}
              opacity={0.25}
            />
          );
        })}

        {/* Wavy grass top edge — replaces flat green rect */}
        <path
          d={`M0,0
            Q50,12 100,5 Q150,-5 200,8 Q250,15 300,3 Q350,-4 400,10 Q450,16 500,4
            Q550,-3 600,9 Q650,14 700,2 Q750,-5 800,8 Q850,18 900,5
            Q950,-2 1000,10 Q1050,15 1100,3 Q1150,-4 1200,9 Q1250,16 1300,4
            Q1350,-3 1400,10 Q1450,14 1500,2 Q1550,-5 1600,8 Q1650,18 1700,5
            Q1750,-2 1800,10 Q1850,15 1900,3 Q1950,-4 2000,9 Q2050,16 2100,4
            Q2150,-3 2200,10 Q2250,14 2300,2 Q2350,-5 2400,8 Q2450,18 2500,5
            Q2550,-2 2600,10 Q2650,15 2700,3 Q2750,-4 2800,9 Q2850,16 2900,4
            Q2950,-3 3000,10 Q3050,14 3100,2 Q3150,-5 3200,8 Q3250,18 3300,5
            Q3350,-2 3400,10 Q3450,15 3500,3 Q3550,-4 3600,9 Q3650,16 3700,4
            Q3750,-3 3800,10 Q3850,14 3900,2 Q3950,-5 4000,8 Q4050,18 4100,5
            Q4150,-2 4200,10 Q4250,15 4300,3 Q4350,-4 4400,9 Q4450,16 4500,4
            Q4550,-3 4600,10 Q4650,14 4700,2 Q4750,-5 4800,8 Q4850,18 4900,5
            Q4950,-2 5000,10 Q5050,15 5100,3 Q5150,-4 5200,9 Q5250,16 5300,4
            Q5350,-3 5400,10 Q5450,14 5500,2 Q5550,-5 5600,8 Q5650,18 5700,5
            Q5750,-2 5800,10 Q5850,15 5900,3 Q5950,-4 6000,9
            L6000,80 L0,80 Z`}
          fill="url(#grass-fill)"
        />
        {/* Grass gradient over the wavy area */}
        <defs>
          <linearGradient id="grass-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7CB668" />
            <stop offset="60%" stopColor="#6BA05A" />
            <stop offset="100%" stopColor="#5E9450" />
          </linearGradient>
        </defs>

        {/* Grass tufts along road edge (above curb) */}
        {Array.from({ length: 100 }).map((_, i) => {
          const tx = i * 60 + 15;
          return (
            <g key={`tuft-${i}`} opacity={0.5}>
              <line x1={tx} y1={92} x2={tx - 2} y2={82} stroke="#6BA05A" strokeWidth={1.5} />
              <line x1={tx + 3} y1={92} x2={tx + 4} y2={80} stroke="#5E9450" strokeWidth={1.2} />
              <line x1={tx + 6} y1={92} x2={tx + 9} y2={84} stroke="#7CB668" strokeWidth={1.3} />
            </g>
          );
        })}

        {/* Stone curb — thin light-gray strip between grass and road */}
        <rect x="0" y="80" width="6000" height="12" fill="#C0BCB4" />
        <rect x="0" y="80" width="6000" height="2" fill="#D5D0C8" opacity="0.6" />
        <rect x="0" y="90" width="6000" height="2" fill="#A8A49C" opacity="0.4" />
        {/* Curb stone joints */}
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={`cj-${i}`}
            x1={i * 100}
            y1={80}
            x2={i * 100}
            y2={92}
            stroke="#A8A49C"
            strokeWidth={0.8}
            opacity={0.3}
          />
        ))}

        {/* Rumble strip pattern at road top edge */}
        {Array.from({ length: 200 }).map((_, i) => (
          <rect
            key={`rum-top-${i}`}
            x={i * 30}
            y={96}
            width={12}
            height={3}
            fill="#585858"
            opacity={0.3}
            rx={1}
          />
        ))}

        {/* Road surface */}
        <rect x="0" y="100" width="6000" height="120" fill="url(#asphalt-grad)" rx="2" />

        {/* Subtle road cracks / patch marks */}
        {[400, 1100, 1800, 2600, 3300, 4100, 4900, 5500].map((cx, i) => (
          <g key={`crack-${i}`} opacity={0.15}>
            <line
              x1={cx}
              y1={120 + (i % 3) * 15}
              x2={cx + 30 + (i % 4) * 10}
              y2={130 + (i % 2) * 20}
              stroke="#333"
              strokeWidth={1}
            />
            <line
              x1={cx + 15}
              y1={125 + (i % 2) * 10}
              x2={cx + 40}
              y2={140 + (i % 3) * 8}
              stroke="#333"
              strokeWidth={0.8}
            />
          </g>
        ))}

        {/* Road patch marks */}
        {[800, 2100, 3700, 5200].map((px, i) => (
          <rect
            key={`patch-${i}`}
            x={px}
            y={130}
            width={40 + (i % 2) * 20}
            height={25}
            fill="#4F4F4F"
            opacity={0.2}
            rx={2}
          />
        ))}

        {/* Road edge lines (solid) */}
        <line x1="0" y1="103" x2="6000" y2="103" stroke="#888" strokeWidth="2.5" />
        <line x1="0" y1="217" x2="6000" y2="217" stroke="#888" strokeWidth="2.5" />

        {/* Center dashed line */}
        <line
          x1="0"
          y1="160"
          x2="6000"
          y2="160"
          stroke="#EEEE99"
          strokeWidth="3"
          strokeDasharray="40 30"
        />

        {/* Reflective cat-eye markers between dashes */}
        {Array.from({ length: 86 }).map((_, i) => {
          const mx = i * 70 + 55;
          return (
            <g key={`cat-${i}`}>
              <rect x={mx} y={158} width={6} height={4} fill="#FFE082" opacity={0.35} rx={1} />
            </g>
          );
        })}

        {/* Rumble strip at road bottom edge */}
        {Array.from({ length: 200 }).map((_, i) => (
          <rect
            key={`rum-bot-${i}`}
            x={i * 30}
            y={220}
            width={12}
            height={3}
            fill="#585858"
            opacity={0.3}
            rx={1}
          />
        ))}

        {/* Shoulder lines (subtle) */}
        <line x1="0" y1="98" x2="6000" y2="98" stroke="#999" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="224" x2="6000" y2="224" stroke="#999" strokeWidth="1" opacity="0.3" />

        {/* Grass tufts along bottom road edge */}
        {Array.from({ length: 80 }).map((_, i) => {
          const tx = i * 75 + 30;
          return (
            <g key={`btuft-${i}`} opacity={0.4}>
              <line x1={tx} y1={228} x2={tx - 2} y2={236} stroke="#6BA05A" strokeWidth={1.3} />
              <line x1={tx + 4} y1={228} x2={tx + 5} y2={238} stroke="#5E9450" strokeWidth={1} />
              <line x1={tx + 7} y1={228} x2={tx + 10} y2={234} stroke="#7CB668" strokeWidth={1.2} />
            </g>
          );
        })}

        {/* Bottom ground area below road */}
        <rect x="0" y="228" width="6000" height="72" fill="url(#ground-grad)" />

        {/* More scattered pebbles below road */}
        {Array.from({ length: 80 }).map((_, i) => {
          const px = i * 75 + ((i * 41) % 40);
          const py = 240 + ((i * 29) % 45);
          return (
            <circle
              key={`peb2-${i}`}
              cx={px}
              cy={py}
              r={1.2 + (i % 3) * 0.4}
              fill={i % 2 === 0 ? "#A08B6A" : "#BCA882"}
              opacity={0.2}
            />
          );
        })}
      </svg>
    </div>
  );
}
