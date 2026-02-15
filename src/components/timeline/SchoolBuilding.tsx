"use client";

export default function SchoolBuilding() {
  return (
    <div
      className="absolute z-10"
      style={{
        left: "4%",
        bottom: "18vh",
        width: "300px",
        transform: "translateX(-50%)",
      }}
    >
      <svg width="300" height="220" viewBox="0 0 300 220">
        {/* Main building */}
        <rect x="50" y="60" width="200" height="140" rx="2" fill="#B85C38" />
        {/* Lighter brick detail */}
        <rect x="55" y="65" width="190" height="130" rx="1" fill="#D4845A" />

        {/* Stone base */}
        <rect x="48" y="180" width="204" height="20" fill="#8B7355" />

        {/* Clock tower */}
        <rect x="120" y="10" width="60" height="55" rx="2" fill="#B85C38" />
        <rect x="124" y="14" width="52" height="47" fill="#D4845A" />
        {/* Tower roof */}
        <polygon points="115,10 150,0 185,10" fill="#7D3C1E" />
        {/* Clock face */}
        <circle cx="150" cy="32" r="14" fill="#FFFDE0" stroke="#8B7355" strokeWidth="2" />
        <line x1="150" y1="32" x2="150" y2="22" stroke="#333" strokeWidth="1.5" />
        <line x1="150" y1="32" x2="158" y2="32" stroke="#333" strokeWidth="1.5" />
        <circle cx="150" cy="32" r="1.5" fill="#333" />

        {/* Arched entrance */}
        <rect x="130" y="130" width="40" height="50" fill="#5D3A1A" />
        <ellipse cx="150" cy="130" rx="20" ry="14" fill="#5D3A1A" />
        {/* Door detail */}
        <line x1="150" y1="125" x2="150" y2="180" stroke="#4A2E14" strokeWidth="1" />
        <circle cx="160" cy="155" r="2" fill="#C9A96E" />

        {/* Steps */}
        <rect x="125" y="182" width="50" height="6" rx="1" fill="#A89070" />
        <rect x="120" y="188" width="60" height="6" rx="1" fill="#9A8265" />
        <rect x="115" y="194" width="70" height="6" rx="1" fill="#8B7355" />

        {/* Windows - first floor */}
        {[70, 95, 185, 210].map((wx) => (
          <g key={`f1-${wx}`}>
            <rect x={wx} y="140" width="18" height="24" rx="2" fill="#87CEEB" stroke="#8B7355" strokeWidth="1" />
            <line x1={wx + 9} y1="140" x2={wx + 9} y2="164" stroke="#8B7355" strokeWidth="0.5" />
            <line x1={wx} y1="152" x2={wx + 18} y2="152" stroke="#8B7355" strokeWidth="0.5" />
          </g>
        ))}

        {/* Windows - second floor */}
        {[70, 95, 120, 160, 185, 210].map((wx) => (
          <g key={`f2-${wx}`}>
            <rect x={wx} y="80" width="18" height="24" rx="2" fill="#87CEEB" stroke="#8B7355" strokeWidth="1" />
            <line x1={wx + 9} y1="80" x2={wx + 9} y2="104" stroke="#8B7355" strokeWidth="0.5" />
            <line x1={wx} y1="92" x2={wx + 18} y2="92" stroke="#8B7355" strokeWidth="0.5" />
          </g>
        ))}

        {/* Roof line */}
        <rect x="46" y="56" width="208" height="6" rx="1" fill="#7D3C1E" />

        {/* Left tree */}
        <rect x="18" y="150" width="6" height="30" fill="#6B4E2A" />
        <ellipse cx="21" cy="135" rx="16" ry="22" fill="#4A7A3D" />
        <ellipse cx="17" cy="140" rx="12" ry="18" fill="#5B8A4E" />

        {/* Right tree */}
        <rect x="272" y="150" width="6" height="30" fill="#6B4E2A" />
        <ellipse cx="275" cy="135" rx="16" ry="22" fill="#4A7A3D" />
        <ellipse cx="279" cy="140" rx="12" ry="18" fill="#5B8A4E" />

        {/* BUS STOP sign */}
        <rect x="255" y="168" width="3" height="32" fill="#777" />
        <rect x="244" y="162" width="25" height="14" rx="2" fill="#F5C542" stroke="#D4A833" strokeWidth="1" />
        <text x="256" y="172" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#333">BUS STOP</text>

        {/* School name */}
        <text x="150" y="74" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFDE0" letterSpacing="1">SCHOOL</text>
      </svg>
    </div>
  );
}
