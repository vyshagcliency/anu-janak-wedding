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

    // Envelope fades in
    tl.fromTo(
      envelopeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    // Wax seal stamps in with a bounce
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

    // 1. Seal cracks — scale up, rotate, fade out
    tl.to(sealRef.current, {
      scale: 1.3,
      rotation: 15,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    // 2. Flap rotates open (3D perspective)
    tl.to(
      flapRef.current,
      {
        rotateX: 180,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=0.1"
    );

    // 3. Card slides up from envelope
    tl.to(
      cardRef.current,
      {
        y: "-40vh",
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // 4. Entire envelope fades away
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
      className="envelope-perspective fixed inset-0 z-50 flex items-end justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Full-screen envelope */}
      <div
        ref={envelopeRef}
        className="relative h-full w-full"
        style={{
          opacity: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Inner liner (visible when flap opens) — fills behind the flap area */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: "52vh",
            background:
              "linear-gradient(135deg, #5B1A1A 0%, #7B2D2D 40%, #5B1A1A 100%)",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            zIndex: 1,
          }}
        >
          {/* Gold filigree pattern */}
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            preserveAspectRatio="none"
          >
            <pattern
              id="filigree"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="25"
                cy="25"
                r="10"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="0.5"
              />
              <circle
                cx="25"
                cy="25"
                r="4"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="0.3"
              />
              <line
                x1="0"
                y1="25"
                x2="50"
                y2="25"
                stroke="var(--gold)"
                strokeWidth="0.15"
              />
              <line
                x1="25"
                y1="0"
                x2="25"
                y2="50"
                stroke="var(--gold)"
                strokeWidth="0.15"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#filigree)" />
          </svg>
        </div>

        {/* Envelope body — bottom portion of screen */}
        <div
          className="envelope-body absolute inset-x-0 bottom-0 overflow-hidden"
          style={{
            height: "55vh",
            background:
              "linear-gradient(165deg, #FAF3E8 0%, #F2E6D0 50%, #EBD9BF 100%)",
            zIndex: 3,
          }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 6px)",
            }}
          />

          {/* Subtle fold lines from envelope sides */}
          <div
            className="absolute left-0 top-0 h-full w-px opacity-10"
            style={{
              left: "15%",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent 60%)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-px opacity-10"
            style={{
              right: "15%",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent 60%)",
            }}
          />

          {/* Gold border accent */}
          <div
            className="absolute inset-4 border sm:inset-6"
            style={{ borderColor: "rgba(201, 169, 110, 0.15)" }}
          />

          {/* Card inside envelope — slides up on open */}
          <div
            ref={cardRef}
            className="absolute inset-x-6 bottom-6 top-6 sm:inset-x-10 sm:bottom-10 sm:top-10"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #FDF9F3 100%)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.06)",
              zIndex: 2,
            }}
          >
            {/* Card gold border */}
            <div
              className="absolute inset-4 border sm:inset-6"
              style={{ borderColor: "rgba(201, 169, 110, 0.25)" }}
            />

            {/* Card content — monogram only */}
            <div className="flex h-full flex-col items-center justify-center px-6">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1"
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

        {/* Envelope flap — full-width triangular, 3D rotation from top */}
        <div
          ref={flapRef}
          className="absolute inset-x-0 top-0"
          style={{
            height: "52vh",
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
                "linear-gradient(165deg, #EFE2CE 0%, #E8D6BF 50%, #E2CDAF 100%)",
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Paper texture on flap */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.006) 4px, rgba(0,0,0,0.006) 8px)",
              }}
            />
            {/* Gold edge line along flap */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                clipPath:
                  "polygon(0 0, 1.5% 0, 50% 97%, 98.5% 0, 100% 0, 50% 100%)",
                background: "var(--gold)",
              }}
            />
          </div>

          {/* Back of flap (visible after rotation) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #5B1A1A 0%, #7B2D2D 40%, #5B1A1A 100%)",
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          />
        </div>

        {/* Wax seal — centered at the flap tip */}
        <div
          ref={sealRef}
          onClick={handleOpen}
          className="seal-shimmer absolute left-1/2 cursor-pointer"
          style={{
            top: "calc(52vh - 44px)",
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
            width="88"
            height="88"
            viewBox="0 0 80 80"
            className="drop-shadow-lg"
          >
            {/* Wax base */}
            <circle cx="40" cy="40" r="36" fill="#8B1A1A" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#A02020"
              strokeWidth="1"
            />
            {/* Wax drip effects */}
            <ellipse cx="18" cy="30" rx="6" ry="5" fill="#8B1A1A" />
            <ellipse cx="62" cy="28" rx="5" ry="6" fill="#8B1A1A" />
            <ellipse cx="25" cy="65" rx="5" ry="4" fill="#8B1A1A" />
            <ellipse cx="58" cy="62" rx="4" ry="5" fill="#8B1A1A" />

            {/* Inner ring */}
            <circle
              cx="40"
              cy="40"
              r="26"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* A & J text */}
            <text
              x="24"
              y="47"
              fontFamily="var(--font-playfair), serif"
              fontSize="22"
              fill="var(--gold)"
              fontWeight="400"
            >
              A
            </text>
            <text
              x="48"
              y="47"
              fontFamily="var(--font-playfair), serif"
              fontSize="22"
              fill="var(--gold)"
              fontWeight="400"
            >
              J
            </text>
            <text
              x="40"
              y="42"
              fontFamily="var(--font-playfair), serif"
              fontSize="10"
              fill="var(--gold-light)"
              textAnchor="middle"
            >
              &amp;
            </text>
          </svg>

          {/* "Tap to open" hint */}
          <p
            className="mt-1 text-center text-[10px] uppercase tracking-[0.2em]"
            style={{
              color: "var(--charcoal-light)",
              fontFamily: "var(--font-body), sans-serif",
              opacity: 0.6,
            }}
          >
            Tap to open
          </p>
        </div>
      </div>
    </div>
  );
}
