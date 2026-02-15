"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function MonogramReveal() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const tl = gsap.timeline({ delay: 0.6 });

    // Draw the circle
    tl.fromTo(
      svgRef.current.querySelector(".monogram-circle"),
      { strokeDashoffset: 350 },
      { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }
    );

    // Fade in letters
    tl.fromTo(
      svgRef.current.querySelector(".letter-a"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    tl.fromTo(
      svgRef.current.querySelector(".letter-j"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Fade in ampersand
    tl.fromTo(
      svgRef.current.querySelector(".ampersand"),
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.2"
    );

    // Decorative dots
    tl.fromTo(
      svgRef.current.querySelectorAll(".dot"),
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.1,
        ease: "back.out(2)",
      },
      "-=0.1"
    );
  }, []);

  return (
    <svg
      ref={svgRef}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      className="mx-auto"
    >
      {/* Outer circle */}
      <circle
        className="monogram-circle"
        cx="80"
        cy="80"
        r="75"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeDasharray="350"
        strokeDashoffset="350"
      />

      {/* Inner decorative circle */}
      <circle
        cx="80"
        cy="80"
        r="68"
        fill="none"
        stroke="var(--gold-light)"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Letter A */}
      <text
        className="letter-a"
        x="48"
        y="95"
        fontFamily="var(--font-playfair), serif"
        fontSize="48"
        fill="var(--gold)"
        opacity="0"
      >
        A
      </text>

      {/* Letter J */}
      <text
        className="letter-j"
        x="90"
        y="95"
        fontFamily="var(--font-playfair), serif"
        fontSize="48"
        fill="var(--gold)"
        opacity="0"
      >
        J
      </text>

      {/* Ampersand */}
      <text
        className="ampersand"
        x="80"
        y="82"
        fontFamily="var(--font-playfair), serif"
        fontSize="16"
        fill="var(--gold-light)"
        textAnchor="middle"
        opacity="0"
      >
        &amp;
      </text>

      {/* Decorative dots */}
      <circle className="dot" cx="35" cy="80" r="2" fill="var(--gold)" opacity="0" />
      <circle className="dot" cx="125" cy="80" r="2" fill="var(--gold)" opacity="0" />
    </svg>
  );
}
