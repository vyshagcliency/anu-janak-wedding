"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  progress: number; // 0 to 1
  vehicleState: "bus" | "transforming" | "plane";
}

export default function SchoolVan({ progress, vehicleState }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const busRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<SVGSVGElement>(null);
  // Keep refs to active tweens so we can kill them on state change
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  // Position along the track: 5% to 95%
  const xPercent = 5 + progress * 90;

  const isPlane = vehicleState === "plane";
  const isTransforming = vehicleState === "transforming";
  const showPlane = isPlane || isTransforming;

  // Vertical position & rotation
  useEffect(() => {
    if (!containerRef.current) return;

    let bottomTarget = "16vh";
    let rotation = 0;

    if (isPlane) {
      bottomTarget = "55vh";
      rotation = -10;
    } else if (isTransforming) {
      bottomTarget = "30vh";
      rotation = -5;
    }

    const tween = gsap.to(containerRef.current, {
      bottom: bottomTarget,
      rotation,
      duration: 1.2,
      ease: "power2.inOut",
    });

    return () => { tween.kill(); };
  }, [vehicleState, isPlane, isTransforming]);

  // Crossfade between bus and plane — kill all previous tweens first
  useEffect(() => {
    if (!busRef.current || !planeRef.current) return;

    // Kill any in-flight crossfade tweens to prevent both showing
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    if (showPlane) {
      // Immediately snap bus hidden, then fade plane in
      gsap.set(busRef.current, { opacity: 0, scale: 0.8 });
      const t = gsap.to(planeRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      tweensRef.current.push(t);
    } else {
      // Immediately snap plane hidden, then fade bus in
      gsap.set(planeRef.current, { opacity: 0, scale: 0.8 });
      const t = gsap.to(busRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      tweensRef.current.push(t);
    }
  }, [vehicleState, showPlane]);

  return (
    <div
      ref={containerRef}
      className="absolute z-20"
      style={{
        bottom: "16vh",
        left: `${xPercent}%`,
        transform: "translateX(-50%)",
        willChange: "transform, bottom",
      }}
    >
      {/* Bus SVG */}
      <svg
        ref={busRef}
        width="140"
        height="80"
        viewBox="0 0 140 80"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Shadow */}
        <ellipse cx="70" cy="76" rx="60" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* Lower body panel */}
        <rect x="10" y="38" width="120" height="28" rx="4" fill="#D4A833" />

        {/* Main body */}
        <rect x="10" y="14" width="120" height="30" rx="8" fill="#F5C542" />

        {/* Roof */}
        <rect x="14" y="10" width="112" height="8" rx="4" fill="#E8B830" />

        {/* Windows with reflection */}
        {[28, 50, 72, 94].map((wx) => (
          <g key={wx}>
            <rect x={wx} y="18" width="16" height="18" rx="3" fill="#B8DEF5" />
            <rect x={wx + 1} y="19" width="6" height="8" rx="1" fill="rgba(255,255,255,0.4)" />
          </g>
        ))}

        {/* Windshield */}
        <rect x="112" y="16" width="16" height="22" rx="3" fill="#B8DEF5" />
        <rect x="113" y="17" width="6" height="10" rx="1" fill="rgba(255,255,255,0.4)" />

        {/* Door */}
        <rect x="14" y="20" width="10" height="24" rx="2" fill="#D4A833" />
        <rect x="16" y="22" width="6" height="10" rx="1" fill="#B8DEF5" />

        {/* Headlights */}
        <circle cx="132" cy="48" r="4" fill="#FFFDE0" />
        <circle cx="132" cy="48" r="2.5" fill="#FFF9C4" />

        {/* Tail lights */}
        <circle cx="12" cy="48" r="3" fill="#EF5350" />

        {/* Bumper */}
        <rect x="126" y="56" width="12" height="4" rx="2" fill="#888" />

        {/* "SCHOOL" text */}
        <text x="70" y="52" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#333">SCHOOL VAN</text>

        {/* Wheels with rotation animation */}
        <g className="wheel-rotate" style={{ transformOrigin: "32px 66px" }}>
          <circle cx="32" cy="66" r="10" fill="#333" />
          <circle cx="32" cy="66" r="6" fill="#666" />
          <circle cx="32" cy="66" r="2" fill="#999" />
          <line x1="32" y1="58" x2="32" y2="74" stroke="#555" strokeWidth="1" />
          <line x1="24" y1="66" x2="40" y2="66" stroke="#555" strokeWidth="1" />
        </g>
        <g className="wheel-rotate" style={{ transformOrigin: "108px 66px" }}>
          <circle cx="108" cy="66" r="10" fill="#333" />
          <circle cx="108" cy="66" r="6" fill="#666" />
          <circle cx="108" cy="66" r="2" fill="#999" />
          <line x1="108" y1="58" x2="108" y2="74" stroke="#555" strokeWidth="1" />
          <line x1="100" y1="66" x2="116" y2="66" stroke="#555" strokeWidth="1" />
        </g>

        {/* Wheel arches */}
        <path d="M20,62 A12,12 0 0,1 44,62" fill="#D4A833" />
        <path d="M96,62 A12,12 0 0,1 120,62" fill="#D4A833" />
      </svg>

      {/* Plane SVG */}
      <svg
        ref={planeRef}
        width="140"
        height="80"
        viewBox="0 0 140 80"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0 }}
      >
        {/* Fuselage */}
        <ellipse cx="70" cy="40" rx="60" ry="14" fill="#E8E8E8" />
        <ellipse cx="70" cy="38" rx="58" ry="10" fill="#F5F5F5" />

        {/* Nose cone */}
        <path d="M130,40 Q140,36 140,40 Q140,44 130,40" fill="#CCC" />

        {/* Cockpit window */}
        <path d="M120,36 Q128,34 130,38 Q126,36 120,38 Z" fill="#87CEEB" />

        {/* Passenger windows */}
        {[40, 52, 64, 76, 88, 100, 110].map((wx) => (
          <circle key={wx} cx={wx} cy="38" r="2.5" fill="#87CEEB" />
        ))}

        {/* Wings */}
        <path d="M58,40 L40,68 L80,40 Z" fill="#D0D0D0" />
        <path d="M58,40 L40,12 L80,40 Z" fill="#D0D0D0" />

        {/* Tail */}
        <path d="M12,40 L2,18 L22,34 Z" fill="#D0D0D0" />
        <path d="M12,40 L2,62 L22,46 Z" fill="#D0D0D0" />

        {/* German flag on tail (black-red-gold tricolor) */}
        <rect x="2" y="22" width="14" height="5" fill="#000" rx="1" />
        <rect x="2" y="27" width="14" height="5" fill="#DD0000" rx="0" />
        <rect x="2" y="32" width="14" height="5" fill="#FFCC00" rx="1" />

        {/* Engine */}
        <ellipse cx="56" cy="58" rx="6" ry="4" fill="#999" />
        <ellipse cx="56" cy="22" rx="6" ry="4" fill="#999" />

        {/* Exhaust trail */}
        {showPlane && (
          <g className="exhaust-puff">
            <circle cx="-5" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
            <circle cx="-15" cy="42" r="4" fill="rgba(255,255,255,0.25)" />
            <circle cx="-28" cy="40" r="5" fill="rgba(255,255,255,0.15)" />
            <circle cx="-44" cy="41" r="6" fill="rgba(255,255,255,0.08)" />
          </g>
        )}
      </svg>
    </div>
  );
}
