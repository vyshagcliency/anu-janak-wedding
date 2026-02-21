"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface Props {
  onRevealed: () => void;
}

export default function EnvelopeReveal({ onRevealed }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current || !sealRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      envelopeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    tl.fromTo(
      sealRef.current,
      { opacity: 0, scale: 0, rotation: -20 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "+=0.3"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (hasOpened.current) return;
    hasOpened.current = true;

    const tl = gsap.timeline({
      onComplete: onRevealed,
    });

    tl.to(sealRef.current, {
      scale: 1.3,
      rotation: 15,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    tl.to(
      flapRef.current,
      {
        rotateX: 180,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=0.1"
    );

    tl.to(
      cardRef.current,
      {
        y: "-40vh",
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.2"
    );

    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      "+=0.2"
    );
  }, [onRevealed]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50"
      style={{
        perspective: "1200px",
        background: "#F7F1EA",
      }}
    >
      <div
        ref={envelopeRef}
        className="relative h-full w-full"
        style={{
          opacity: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Inner liner — deep burgundy, visible when flap opens */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "55vh",
            background:
              "linear-gradient(180deg, #4A1520 0%, #6B2030 60%, #4A1520 100%)",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            zIndex: 1,
          }}
        />

        {/* Envelope body — lower portion, clean paper */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "52vh",
            background:
              "linear-gradient(175deg, #F5EDE2 0%, #EDE3D5 40%, #E8DBCA 100%)",
            boxShadow: "0 -1px 0 rgba(0,0,0,0.04)",
            zIndex: 3,
          }}
        >
          {/* Realistic paper grain — very subtle noise texture */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.4,
              backgroundImage:
                `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Left fold shadow */}
          <div
            className="absolute top-0 h-full"
            style={{
              left: 0,
              width: "30%",
              background: "linear-gradient(to right, rgba(0,0,0,0.03), transparent)",
              clipPath: "polygon(0 0, 100% 30%, 0 100%)",
            }}
          />
          {/* Right fold shadow */}
          <div
            className="absolute top-0 h-full"
            style={{
              right: 0,
              width: "30%",
              background: "linear-gradient(to left, rgba(0,0,0,0.03), transparent)",
              clipPath: "polygon(100% 0, 0 30%, 100% 100%)",
            }}
          />

          {/* Card inside envelope */}
          <div
            ref={cardRef}
            className="absolute left-[8%] right-[8%] bottom-[8%] top-[8%]"
            style={{
              background: "#FFFDF9",
              boxShadow:
                "0 1px 8px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.08)",
              zIndex: 2,
            }}
          >
            <div className="flex h-full flex-col items-center justify-center">
              <svg width="70" height="70" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="0.8"
                />
                <text
                  x="32"
                  y="72"
                  fontFamily="var(--font-playfair), serif"
                  fontSize="36"
                  fill="var(--gold)"
                >
                  A
                </text>
                <text
                  x="68"
                  y="72"
                  fontFamily="var(--font-playfair), serif"
                  fontSize="36"
                  fill="var(--gold)"
                >
                  J
                </text>
                <text
                  x="50"
                  y="64"
                  fontFamily="var(--font-playfair), serif"
                  fontSize="14"
                  fill="var(--gold-light)"
                  textAnchor="middle"
                >
                  &amp;
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Envelope flap — large triangle from top */}
        <div
          ref={flapRef}
          className="absolute inset-x-0 top-0"
          style={{
            height: "55vh",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            zIndex: 4,
            willChange: "transform",
          }}
        >
          {/* Front of flap */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(175deg, #F0E6D8 0%, #E8DCCC 50%, #E2D4C2 100%)",
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Paper grain on flap */}
            <div
              className="absolute inset-0"
              style={{
                opacity: 0.35,
                backgroundImage:
                  `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
              }}
            />
            {/* Subtle shadow at fold crease */}
            <div
              className="absolute inset-x-0 bottom-0 h-8"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.06), transparent)",
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
              }}
            />
          </div>

          {/* Back of flap */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #4A1520 0%, #6B2030 60%, #4A1520 100%)",
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          />
        </div>

        {/* Wax seal — clean, refined */}
        <div
          ref={sealRef}
          onClick={handleOpen}
          className="seal-shimmer absolute left-1/2 cursor-pointer"
          style={{
            top: "calc(55vh - 48px)",
            transform: "translateX(-50%)",
            zIndex: 5,
            opacity: 0,
            willChange: "transform, opacity",
          }}
          role="button"
          aria-label="Open wedding invitation"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
        >
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
          >
            {/* Outer wax — slightly irregular with radial gradient for depth */}
            <defs>
              <radialGradient id="waxGrad" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#A62B2B" />
                <stop offset="60%" stopColor="#8B1A1A" />
                <stop offset="100%" stopColor="#6E1414" />
              </radialGradient>
              <filter id="waxShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
              </filter>
            </defs>
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="url(#waxGrad)"
              filter="url(#waxShadow)"
            />
            {/* Subtle rim highlight */}
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* Decorative outer ring */}
            <circle
              cx="48"
              cy="48"
              r="34"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="0.7"
              opacity="0.5"
            />
            {/* Inner ring */}
            <circle
              cx="48"
              cy="48"
              r="30"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="0.4"
              opacity="0.3"
            />

            {/* A & J monogram */}
            <text
              x="30"
              y="56"
              fontFamily="var(--font-playfair), serif"
              fontSize="26"
              fill="var(--gold)"
              fontWeight="400"
            >
              A
            </text>
            <text
              x="54"
              y="56"
              fontFamily="var(--font-playfair), serif"
              fontSize="26"
              fill="var(--gold)"
              fontWeight="400"
            >
              J
            </text>
            <text
              x="48"
              y="49"
              fontFamily="var(--font-playfair), serif"
              fontSize="11"
              fill="var(--gold-light)"
              textAnchor="middle"
            >
              &amp;
            </text>
          </svg>

          <p
            className="mt-2 text-center text-[10px] uppercase tracking-[0.2em]"
            style={{
              color: "rgba(90, 70, 50, 0.5)",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            Tap to open
          </p>
        </div>
      </div>
    </div>
  );
}
