"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface Props {
  onRevealed: () => void;
}

export default function EnvelopeReveal({ onRevealed }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const outerBorderRef = useRef<SVGRectElement>(null);
  const innerBorderRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<SVGSVGElement>(null);
  const invitedTextRef = useRef<HTMLParagraphElement>(null);
  const monogramARef = useRef<SVGTextElement>(null);
  const monogramAmpRef = useRef<SVGTextElement>(null);
  const monogramJRef = useRef<SVGTextElement>(null);
  const monogramCircleRef = useRef<SVGCircleElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const tapPromptRef = useRef<HTMLParagraphElement>(null);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const centerGlowRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Skip animations — show everything immediately
      gsap.set(cardRef.current, { opacity: 1, scale: 1 });
      gsap.set(
        [
          innerBorderRef.current,
          ornamentRef.current,
          invitedTextRef.current,
          ruleRef.current,
          tapPromptRef.current,
        ],
        { opacity: 1 }
      );
      gsap.set([monogramARef.current, monogramAmpRef.current, monogramJRef.current], { opacity: 1 });
      gsap.set(monogramCircleRef.current, { opacity: 1 });
      gsap.set(ruleRef.current, { scaleX: 1 });
      if (outerBorderRef.current) {
        outerBorderRef.current.style.strokeDashoffset = "0";
      }
      return;
    }

    const tl = gsap.timeline();

    // Card fade in with scale
    tl.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    );

    // Outer gold border draws clockwise via strokeDashoffset
    if (outerBorderRef.current) {
      const perimeter = outerBorderRef.current.getTotalLength();
      gsap.set(outerBorderRef.current, {
        strokeDasharray: perimeter,
        strokeDashoffset: perimeter,
      });
      tl.to(
        outerBorderRef.current,
        { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" },
        "-=0.3"
      );
    }

    // Inner border fades in
    tl.fromTo(
      innerBorderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power1.out" },
      "-=0.5"
    );

    // Ornament draws itself
    tl.fromTo(
      ornamentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power1.out" },
      "-=0.2"
    );

    // "You are invited" fades in
    tl.fromTo(
      invitedTextRef.current,
      { opacity: 0 },
      { opacity: 0.6, duration: 0.4, ease: "power1.out" },
      "-=0.1"
    );

    // Monogram circle
    if (monogramCircleRef.current) {
      const circPerimeter = monogramCircleRef.current.getTotalLength();
      gsap.set(monogramCircleRef.current, {
        strokeDasharray: circPerimeter,
        strokeDashoffset: circPerimeter,
      });
      tl.to(
        monogramCircleRef.current,
        { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" },
        "-=0.2"
      );
    }

    // Monogram letters stagger in
    tl.fromTo(
      [monogramARef.current, monogramAmpRef.current, monogramJRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.15, ease: "power1.out" },
      "-=0.3"
    );

    // Gold rule expands from center
    tl.fromTo(
      ruleRef.current,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // "Tap to reveal" fades in
    tl.fromTo(
      tapPromptRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power1.out" },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Reveal animation on tap
  const handleOpen = useCallback(() => {
    if (hasOpened.current) return;
    hasOpened.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onRevealed,
      });
      return;
    }

    const tl = gsap.timeline({ onComplete: onRevealed });

    // Fade out tap prompt
    tl.to(tapPromptRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: "power1.in",
    });

    // Hide original card, show clip-path halves
    tl.call(() => {
      gsap.set(cardRef.current, { opacity: 0 });
      gsap.set([leftHalfRef.current, rightHalfRef.current], {
        visibility: "visible",
        opacity: 1,
      });
    });

    // Split halves apart with subtle 3D rotation
    tl.to(
      leftHalfRef.current,
      {
        x: "-55%",
        rotateY: 15,
        opacity: 0.6,
        duration: 0.7,
        ease: "power2.inOut",
      },
      "+=0.05"
    );
    tl.to(
      rightHalfRef.current,
      {
        x: "55%",
        rotateY: -15,
        opacity: 0.6,
        duration: 0.7,
        ease: "power2.inOut",
      },
      "<"
    );

    // Gold glow fades in between halves
    tl.fromTo(
      centerGlowRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power1.out" },
      "-=0.4"
    );

    // Everything fades out
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.97,
        duration: 0.5,
        ease: "power2.in",
      },
      "+=0.1"
    );
  }, [onRevealed]);

  // Shared card content for both the main card and clip-path halves
  const cardContent = (
    <>
      {/* Envelope flap — decorative V at top */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "24%",
          background:
            "linear-gradient(175deg, #F7F3EE 0%, #EDE8E1 100%)",
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        {/* Flap fold shadow */}
        <div
          className="absolute inset-x-0 bottom-0 h-6"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.04), transparent)",
            clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
          }}
        />
      </div>

      {/* Flap inner liner — muted blush/rose accent visible behind flap */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "22%",
          background:
            "linear-gradient(180deg, #E8D5C4 0%, #DECCBB 60%, #E8D5C4 100%)",
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Paper grain texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Outer gold border — SVG rect drawn with strokeDashoffset */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 440 528"
        preserveAspectRatio="none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <rect
          ref={outerBorderRef}
          x="0.5"
          y="0.5"
          width="439"
          height="527"
          rx="4"
          ry="4"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1"
        />
        {/* Corner flourishes — top-left */}
        <g stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M 20 40 Q 20 20 40 20" />
          <path d="M 16 48 Q 16 16 48 16" />
          {/* top-right */}
          <path d="M 400 20 Q 420 20 420 40" />
          <path d="M 392 16 Q 424 16 424 48" />
          {/* bottom-left */}
          <path d="M 40 508 Q 20 508 20 488" />
          <path d="M 48 512 Q 16 512 16 480" />
          {/* bottom-right */}
          <path d="M 420 488 Q 420 508 400 508" />
          <path d="M 424 480 Q 424 512 392 512" />
        </g>
      </svg>

      {/* Inner border */}
      <div
        ref={innerBorderRef}
        className="absolute rounded-sm"
        style={{
          inset: "14px",
          border: "0.5px solid rgba(201, 169, 110, 0.35)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content stack */}
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 py-10" style={{ zIndex: 3 }}>
        {/* Ornamental flourish */}
        <svg
          ref={ornamentRef}
          width="160"
          height="16"
          viewBox="0 0 160 16"
          fill="none"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <line x1="0" y1="8" x2="62" y2="8" stroke="var(--gold)" strokeWidth="0.5" />
          <line x1="98" y1="8" x2="160" y2="8" stroke="var(--gold)" strokeWidth="0.5" />
          {/* Center diamond */}
          <rect
            x="74"
            y="2"
            width="12"
            height="12"
            transform="rotate(45 80 8)"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.5"
          />
          {/* Small dots flanking diamond */}
          <circle cx="66" cy="8" r="1" fill="var(--gold)" opacity="0.5" />
          <circle cx="94" cy="8" r="1" fill="var(--gold)" opacity="0.5" />
        </svg>

        {/* "You are invited to celebrate" */}
        <p
          ref={invitedTextRef}
          className="text-center text-[10px] uppercase tracking-[0.25em]"
          style={{
            color: "var(--gold)",
            fontFamily: "var(--font-body), sans-serif",
            opacity: 0,
          }}
        >
          You are invited to celebrate
        </p>

        {/* A & J Monogram */}
        <svg width="90" height="90" viewBox="0 0 120 120" aria-label="A and J monogram">
          <circle
            ref={monogramCircleRef}
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.8"
          />
          <text
            ref={monogramARef}
            x="32"
            y="72"
            fontFamily="var(--font-playfair), serif"
            fontSize="36"
            fill="var(--gold)"
            style={{ opacity: 0 }}
          >
            A
          </text>
          <text
            ref={monogramAmpRef}
            x="50"
            y="64"
            fontFamily="var(--font-playfair), serif"
            fontSize="14"
            fill="var(--gold)"
            textAnchor="middle"
            style={{ opacity: 0 }}
          >
            &amp;
          </text>
          <text
            ref={monogramJRef}
            x="68"
            y="72"
            fontFamily="var(--font-playfair), serif"
            fontSize="36"
            fill="var(--gold)"
            style={{ opacity: 0 }}
          >
            J
          </text>
        </svg>

        {/* Gold horizontal rule */}
        <div
          ref={ruleRef}
          className="h-px w-40"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold-light) 50%, var(--gold) 80%, transparent 100%)",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />

        {/* "Tap to reveal" */}
        <p
          ref={tapPromptRef}
          className="tap-prompt-pulse text-center text-[10px] uppercase tracking-[0.2em]"
          style={{
            color: "var(--gold)",
            fontFamily: "var(--font-body), sans-serif",
            opacity: 0,
          }}
        >
          Tap to reveal
        </p>
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Blurred photo background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/envelope-bg.jpeg"
          alt=""
          fill
          priority
          className="object-cover blur-[20px] scale-110"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>

      {/* Card wrapper — centered */}
      <div className="relative w-[90vw] max-w-[440px]" style={{ aspectRatio: "5 / 6" }}>
        {/* Main visible card */}
        <div
          ref={cardRef}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          role="button"
          aria-label="Open wedding invitation"
          tabIndex={0}
          className="invitation-card-glow absolute inset-0 cursor-pointer overflow-hidden rounded-sm"
          style={{
            background: "linear-gradient(175deg, #FFFDF9 0%, #FAF7F2 40%, #F5F0E8 100%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.08)",
            opacity: 0,
          }}
        >
          {cardContent}
        </div>

        {/* Left clip-path half (invisible until tap) */}
        <div
          ref={leftHalfRef}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
          style={{
            background: "linear-gradient(175deg, #FFFDF9 0%, #FAF7F2 40%, #F5F0E8 100%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.08)",
            clipPath: "inset(0 50% 0 0)",
            visibility: "hidden",
            opacity: 0,
          }}
          aria-hidden="true"
        >
          {cardContent}
        </div>

        {/* Right clip-path half (invisible until tap) */}
        <div
          ref={rightHalfRef}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
          style={{
            background: "linear-gradient(175deg, #FFFDF9 0%, #FAF7F2 40%, #F5F0E8 100%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.08)",
            clipPath: "inset(0 0 0 50%)",
            visibility: "hidden",
            opacity: 0,
          }}
          aria-hidden="true"
        >
          {cardContent}
        </div>

        {/* Center glow (shown during split) */}
        <div
          ref={centerGlowRef}
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{
            width: "60px",
            background:
              "radial-gradient(ellipse at center, rgba(201,169,110,0.4) 0%, rgba(201,169,110,0.15) 40%, transparent 70%)",
            opacity: 0,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
