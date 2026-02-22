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

  // Card decoration shell (shared between main card and split halves)
  const cardDecoration = (
    <>
      {/* Envelope flap — decorative V at top */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "24%",
          background: "linear-gradient(175deg, #F7F3EE 0%, #EDE8E1 100%)",
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-x-0 bottom-0 h-6"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.04), transparent)",
            clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
          }}
        />
      </div>

      {/* Flap inner liner */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "22%",
          background: "linear-gradient(180deg, #E8D5C4 0%, #DECCBB 60%, #E8D5C4 100%)",
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

      {/* Gold border + corner flourishes SVG */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 440 528"
        preserveAspectRatio="none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <rect x="0.5" y="0.5" width="439" height="527" rx="4" ry="4" fill="none" stroke="var(--gold)" strokeWidth="1" />
        <g stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M 20 40 Q 20 20 40 20" />
          <path d="M 16 48 Q 16 16 48 16" />
          <path d="M 400 20 Q 420 20 420 40" />
          <path d="M 392 16 Q 424 16 424 48" />
          <path d="M 40 508 Q 20 508 20 488" />
          <path d="M 48 512 Q 16 512 16 480" />
          <path d="M 420 488 Q 420 508 400 508" />
          <path d="M 424 480 Q 424 512 392 512" />
        </g>
      </svg>

      {/* Inner border */}
      <div
        className="absolute rounded-sm"
        style={{
          inset: "14px",
          border: "0.5px solid rgba(201, 169, 110, 0.35)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Side filigree — left */}
      <svg className="absolute" style={{ left: "22px", top: "50%", transform: "translateY(-50%)", zIndex: 2 }} width="8" height="80" viewBox="0 0 8 80" fill="none" aria-hidden="true">
        <line x1="4" y1="0" x2="4" y2="25" stroke="var(--gold)" strokeWidth="0.4" opacity="0.3" />
        <circle cx="4" cy="28" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.35" />
        <circle cx="4" cy="40" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.4" />
        <circle cx="4" cy="52" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.35" />
        <line x1="4" y1="55" x2="4" y2="80" stroke="var(--gold)" strokeWidth="0.4" opacity="0.3" />
      </svg>

      {/* Side filigree — right */}
      <svg className="absolute" style={{ right: "22px", top: "50%", transform: "translateY(-50%)", zIndex: 2 }} width="8" height="80" viewBox="0 0 8 80" fill="none" aria-hidden="true">
        <line x1="4" y1="0" x2="4" y2="25" stroke="var(--gold)" strokeWidth="0.4" opacity="0.3" />
        <circle cx="4" cy="28" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.35" />
        <circle cx="4" cy="40" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.4" />
        <circle cx="4" cy="52" r="1.5" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.35" />
        <line x1="4" y1="55" x2="4" y2="80" stroke="var(--gold)" strokeWidth="0.4" opacity="0.3" />
      </svg>
    </>
  );

  // Static content for the split halves (everything visible, no refs)
  const staticContent = (
    <div className="relative flex h-full flex-col items-center justify-center gap-3 px-8 py-8" style={{ zIndex: 3 }}>
      <svg width="200" height="32" viewBox="0 0 200 32" fill="none" aria-hidden="true">
        <path d="M 10 16 Q 30 16 40 10 Q 50 4 60 8 Q 68 11 72 16" stroke="var(--gold)" strokeWidth="0.6" fill="none" />
        <path d="M 30 16 Q 38 20 44 16" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 190 16 Q 170 16 160 10 Q 150 4 140 8 Q 132 11 128 16" stroke="var(--gold)" strokeWidth="0.6" fill="none" />
        <path d="M 170 16 Q 162 20 156 16" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <rect x="94" y="10" width="12" height="12" transform="rotate(45 100 16)" fill="none" stroke="var(--gold)" strokeWidth="0.6" />
        <circle cx="80" cy="16" r="1.2" fill="var(--gold)" opacity="0.4" />
        <circle cx="120" cy="16" r="1.2" fill="var(--gold)" opacity="0.4" />
        <circle cx="18" cy="16" r="0.8" fill="var(--gold)" opacity="0.3" />
        <circle cx="182" cy="16" r="0.8" fill="var(--gold)" opacity="0.3" />
        <line x1="0" y1="16" x2="10" y2="16" stroke="var(--gold)" strokeWidth="0.3" opacity="0.4" />
        <line x1="190" y1="16" x2="200" y2="16" stroke="var(--gold)" strokeWidth="0.3" opacity="0.4" />
      </svg>
      <p className="text-center text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--gold)", fontFamily: "var(--font-body), sans-serif", opacity: 0.6 }}>You are invited to celebrate</p>
      <div className="h-px w-44" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-light) 50%, var(--gold) 85%, transparent 100%)" }} />
      <svg width="130" height="130" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="75" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.35" />
        <circle cx="80" cy="5" r="1.5" fill="var(--gold)" opacity="0.4" />
        <circle cx="80" cy="155" r="1.5" fill="var(--gold)" opacity="0.4" />
        <circle cx="5" cy="80" r="1.5" fill="var(--gold)" opacity="0.4" />
        <circle cx="155" cy="80" r="1.5" fill="var(--gold)" opacity="0.4" />
        <text x="38" y="96" fontFamily="var(--font-playfair), serif" fontSize="52" fontWeight="400" fontStyle="italic" fill="var(--gold)">A</text>
        <text x="80" y="86" fontFamily="var(--font-playfair), serif" fontSize="18" fontStyle="italic" fill="var(--gold)" textAnchor="middle" opacity="0.7">&amp;</text>
        <text x="92" y="96" fontFamily="var(--font-playfair), serif" fontSize="52" fontWeight="400" fontStyle="italic" fill="var(--gold)">J</text>
      </svg>
      <div className="h-px w-44" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-light) 50%, var(--gold) 85%, transparent 100%)" }} />
      <svg width="80" height="20" viewBox="0 0 80 20" fill="none" aria-hidden="true">
        <path d="M 40 10 Q 30 6 20 10 Q 14 12 8 10" stroke="var(--gold)" strokeWidth="0.5" fill="none" />
        <path d="M 28 8 Q 24 4 20 6" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 24 10 Q 20 14 16 12" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 40 10 Q 50 6 60 10 Q 66 12 72 10" stroke="var(--gold)" strokeWidth="0.5" fill="none" />
        <path d="M 52 8 Q 56 4 60 6" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 56 10 Q 60 14 64 12" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <circle cx="40" cy="10" r="1" fill="var(--gold)" opacity="0.5" />
      </svg>
      <svg width="140" height="20" viewBox="0 0 140 20" fill="none" aria-hidden="true">
        <path d="M 10 10 Q 25 10 35 6 Q 42 3 50 6 Q 56 8 62 10" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 130 10 Q 115 10 105 6 Q 98 3 90 6 Q 84 8 78 10" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
        <rect x="64" y="4" width="12" height="12" transform="rotate(45 70 10)" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.4" />
      </svg>
    </div>
  );

  // Main card content with refs for entrance animation
  const mainCardContent = (
    <>
      {/* Outer gold border with ref for draw animation */}
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
        <g stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M 20 40 Q 20 20 40 20" />
          <path d="M 16 48 Q 16 16 48 16" />
          <path d="M 400 20 Q 420 20 420 40" />
          <path d="M 392 16 Q 424 16 424 48" />
          <path d="M 40 508 Q 20 508 20 488" />
          <path d="M 48 512 Q 16 512 16 480" />
          <path d="M 420 488 Q 420 508 400 508" />
          <path d="M 424 480 Q 424 512 392 512" />
        </g>
      </svg>

      {/* Inner border with ref */}
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

      {/* Content stack with refs */}
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-8 py-8" style={{ zIndex: 3 }}>
        {/* Top ornamental flourish */}
        <svg
          ref={ornamentRef}
          width="200"
          height="32"
          viewBox="0 0 200 32"
          fill="none"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <path d="M 10 16 Q 30 16 40 10 Q 50 4 60 8 Q 68 11 72 16" stroke="var(--gold)" strokeWidth="0.6" fill="none" />
          <path d="M 30 16 Q 38 20 44 16" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <path d="M 190 16 Q 170 16 160 10 Q 150 4 140 8 Q 132 11 128 16" stroke="var(--gold)" strokeWidth="0.6" fill="none" />
          <path d="M 170 16 Q 162 20 156 16" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <rect x="94" y="10" width="12" height="12" transform="rotate(45 100 16)" fill="none" stroke="var(--gold)" strokeWidth="0.6" />
          <circle cx="80" cy="16" r="1.2" fill="var(--gold)" opacity="0.4" />
          <circle cx="120" cy="16" r="1.2" fill="var(--gold)" opacity="0.4" />
          <circle cx="18" cy="16" r="0.8" fill="var(--gold)" opacity="0.3" />
          <circle cx="182" cy="16" r="0.8" fill="var(--gold)" opacity="0.3" />
          <line x1="0" y1="16" x2="10" y2="16" stroke="var(--gold)" strokeWidth="0.3" opacity="0.4" />
          <line x1="190" y1="16" x2="200" y2="16" stroke="var(--gold)" strokeWidth="0.3" opacity="0.4" />
        </svg>

        {/* "You are invited to celebrate" */}
        <p
          ref={invitedTextRef}
          className="text-center text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body), sans-serif", opacity: 0 }}
        >
          You are invited to celebrate
        </p>

        {/* Gold rule above monogram */}
        <div
          ref={ruleRef}
          className="h-px w-44"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-light) 50%, var(--gold) 85%, transparent 100%)",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />

        {/* A & J Monogram — large, premium */}
        <svg width="130" height="130" viewBox="0 0 160 160" aria-label="A and J monogram">
          <circle ref={monogramCircleRef} cx="80" cy="80" r="75" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.35" />
          <circle cx="80" cy="5" r="1.5" fill="var(--gold)" opacity="0.4" />
          <circle cx="80" cy="155" r="1.5" fill="var(--gold)" opacity="0.4" />
          <circle cx="5" cy="80" r="1.5" fill="var(--gold)" opacity="0.4" />
          <circle cx="155" cy="80" r="1.5" fill="var(--gold)" opacity="0.4" />
          <text ref={monogramARef} x="38" y="96" fontFamily="var(--font-playfair), serif" fontSize="52" fontWeight="400" fontStyle="italic" fill="var(--gold)" style={{ opacity: 0 }}>A</text>
          <text ref={monogramAmpRef} x="80" y="86" fontFamily="var(--font-playfair), serif" fontSize="18" fontStyle="italic" fill="var(--gold)" textAnchor="middle" style={{ opacity: 0 }}>&amp;</text>
          <text ref={monogramJRef} x="92" y="96" fontFamily="var(--font-playfair), serif" fontSize="52" fontWeight="400" fontStyle="italic" fill="var(--gold)" style={{ opacity: 0 }}>J</text>
        </svg>

        {/* Gold rule below monogram */}
        <div className="h-px w-44" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-light) 50%, var(--gold) 85%, transparent 100%)" }} />

        {/* Leaf / branch motif */}
        <svg width="80" height="20" viewBox="0 0 80 20" fill="none" aria-hidden="true">
          <path d="M 40 10 Q 30 6 20 10 Q 14 12 8 10" stroke="var(--gold)" strokeWidth="0.5" fill="none" />
          <path d="M 28 8 Q 24 4 20 6" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <path d="M 24 10 Q 20 14 16 12" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <path d="M 40 10 Q 50 6 60 10 Q 66 12 72 10" stroke="var(--gold)" strokeWidth="0.5" fill="none" />
          <path d="M 52 8 Q 56 4 60 6" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <path d="M 56 10 Q 60 14 64 12" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <circle cx="40" cy="10" r="1" fill="var(--gold)" opacity="0.5" />
        </svg>

        {/* "Tap to reveal" */}
        <p
          ref={tapPromptRef}
          className="tap-prompt-pulse text-center text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--gold)", fontFamily: "var(--font-body), sans-serif", opacity: 0 }}
        >
          Tap to reveal
        </p>

        {/* Bottom ornamental flourish */}
        <svg width="140" height="20" viewBox="0 0 140 20" fill="none" aria-hidden="true">
          <path d="M 10 10 Q 25 10 35 6 Q 42 3 50 6 Q 56 8 62 10" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <path d="M 130 10 Q 115 10 105 6 Q 98 3 90 6 Q 84 8 78 10" stroke="var(--gold)" strokeWidth="0.4" fill="none" opacity="0.5" />
          <rect x="64" y="4" width="12" height="12" transform="rotate(45 70 10)" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.4" />
        </svg>
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

      {/* Card wrapper — centered, shorter on mobile */}
      <div className="relative w-[90vw] max-w-[440px] max-h-[72vh] md:max-h-none" style={{ aspectRatio: "5 / 6" }}>
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
          {cardDecoration}
          {mainCardContent}
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
          {cardDecoration}
          {staticContent}
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
          {cardDecoration}
          {staticContent}
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
