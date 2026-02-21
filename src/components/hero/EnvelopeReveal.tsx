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

    // Envelope fades in with scale-up
    tl.fromTo(
      envelopeRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
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
    tl.fromTo(
      cardRef.current,
      { y: 0 },
      {
        y: -280,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // 4. Entire envelope fades and scales away
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in",
      },
      "+=0.2"
    );
  }, [onRevealed]);

  return (
    <div
      ref={containerRef}
      className="envelope-perspective fixed inset-0 z-50 flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Envelope wrapper */}
      <div
        ref={envelopeRef}
        className="relative max-w-[90vw] sm:max-w-md"
        style={{
          width: "380px",
          opacity: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Inner liner (visible when flap opens) */}
        <div
          className="absolute left-0 right-0 top-0 overflow-hidden rounded-t-lg"
          style={{
            height: "180px",
            background:
              "linear-gradient(135deg, #5B1A1A 0%, #7B2D2D 40%, #5B1A1A 100%)",
            clipPath: "polygon(0 0, 50% 60%, 100% 0)",
            zIndex: 1,
          }}
        >
          {/* Gold filigree pattern */}
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 380 180"
            preserveAspectRatio="none"
          >
            <pattern
              id="filigree"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="20"
                cy="20"
                r="8"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="0.5"
              />
              <circle
                cx="20"
                cy="20"
                r="3"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="0.3"
              />
              <line
                x1="0"
                y1="20"
                x2="40"
                y2="20"
                stroke="var(--gold)"
                strokeWidth="0.2"
              />
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="40"
                stroke="var(--gold)"
                strokeWidth="0.2"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#filigree)" />
          </svg>
        </div>

        {/* Envelope body */}
        <div
          className="envelope-body relative overflow-hidden rounded-lg"
          style={{
            height: "280px",
            background:
              "linear-gradient(165deg, #FAF3E8 0%, #F2E6D0 50%, #EBD9BF 100%)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
            zIndex: 3,
          }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)",
            }}
          />

          {/* Gold border accent */}
          <div
            className="absolute inset-2 rounded-md border"
            style={{ borderColor: "rgba(201, 169, 110, 0.2)" }}
          />

          {/* Card inside envelope (peeks out, slides up on open) */}
          <div
            ref={cardRef}
            className="absolute bottom-4 left-4 right-4 rounded-md"
            style={{
              height: "240px",
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #FDF9F3 100%)",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
              zIndex: 2,
              transformOrigin: "center bottom",
            }}
          >
            {/* Card gold border */}
            <div
              className="absolute inset-3 rounded border"
              style={{ borderColor: "rgba(201, 169, 110, 0.3)" }}
            />

            {/* Card content preview */}
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6">
              <svg width="60" height="60" viewBox="0 0 120 120">
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
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                You&apos;re Invited
              </p>
            </div>
          </div>
        </div>

        {/* Envelope flap (triangular, 3D rotation) */}
        <div
          ref={flapRef}
          className="absolute left-0 right-0 top-0"
          style={{
            height: "180px",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            zIndex: 4,
            willChange: "transform",
          }}
        >
          {/* Front of flap (visible initially) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, #EFE2CE 0%, #E5D4BA 100%)",
              clipPath: "polygon(0 0, 50% 70%, 100% 0)",
              backfaceVisibility: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Gold edge line */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                clipPath:
                  "polygon(0 0, 2% 0, 50% 68%, 98% 0, 100% 0, 50% 70%)",
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
              clipPath: "polygon(0 0, 50% 70%, 100% 0)",
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          />
        </div>

        {/* Wax seal */}
        <div
          ref={sealRef}
          onClick={handleOpen}
          className="seal-shimmer absolute left-1/2 cursor-pointer"
          style={{
            top: "110px",
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
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="drop-shadow-lg"
          >
            {/* Wax base with irregular edges */}
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
            className="mt-2 text-center text-[10px] uppercase tracking-[0.2em]"
            style={{
              color: "var(--champagne)",
              fontFamily: "var(--font-body), sans-serif",
              opacity: 0.8,
            }}
          >
            Tap to open
          </p>
        </div>
      </div>
    </div>
  );
}
