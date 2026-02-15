"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───── Per-stop theme colors ───── */
const STOP_THEMES: Record<
  number,
  { border: string; glow: string; textAccent: string }
> = {
  1: {
    border: "rgba(245, 222, 179, 0.4)",
    glow: "0 0 20px rgba(245, 222, 179, 0.3)",
    textAccent: "#D4A833",
  },
  2: {
    border: "rgba(144, 202, 249, 0.4)",
    glow: "0 0 20px rgba(144, 202, 249, 0.3)",
    textAccent: "#64B5F6",
  },
  3: {
    border: "rgba(255, 204, 128, 0.4)",
    glow: "0 0 20px rgba(255, 204, 128, 0.3)",
    textAccent: "#FFB74D",
  },
  4: {
    border: "rgba(176, 190, 197, 0.4)",
    glow: "0 0 20px rgba(176, 190, 197, 0.3)",
    textAccent: "#90A4AE",
  },
  5: {
    border: "rgba(57, 73, 171, 0.5)",
    glow: "0 0 24px rgba(57, 73, 171, 0.4), 0 0 60px rgba(57, 73, 171, 0.15)",
    textAccent: "#7986CB",
  },
  6: {
    border: "rgba(201, 169, 110, 0.6)",
    glow: "0 0 30px rgba(201, 169, 110, 0.4), 0 0 60px rgba(201, 169, 110, 0.15)",
    textAccent: "#C9A96E",
  },
};

interface Props {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  position: number;
  revealType?: "circle" | "slide" | "fade" | "split" | "blur" | "grand";
}

export default function TimelineStop({
  index,
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  position,
  revealType = "fade",
}: Props) {
  const stopRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const theme = STOP_THEMES[index] ?? STOP_THEMES[1];
  const isGrand = revealType === "grand";
  const isCh5 = index === 5;

  useEffect(() => {
    if (!stopRef.current || !imageRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stopRef.current,
        start: "left 80%",
        end: "left 20%",
        containerAnimation: ScrollTrigger.getAll().find(
          (st) => st.vars?.id === "timeline-horizontal"
        )?.animation,
        toggleActions: "play none none reverse",
      },
    });

    // Marker glow
    if (markerRef.current) {
      tl.fromTo(
        markerRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
        0
      );
    }

    // Image reveal based on type
    const img = imageRef.current;
    switch (revealType) {
      case "circle":
        tl.fromTo(
          img,
          { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
          { clipPath: "circle(75% at 50% 50%)", opacity: 1, duration: 0.8, ease: "power2.out" },
          0.1
        );
        break;
      case "slide":
        tl.fromTo(
          img,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          0.1
        );
        break;
      case "blur":
        tl.fromTo(
          img,
          { filter: "blur(20px)", opacity: 0 },
          { filter: "blur(0px)", opacity: 1, duration: 0.8, ease: "power2.out" },
          0.1
        );
        break;
      case "split":
        tl.fromTo(
          img,
          { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 0.8, ease: "power2.out" },
          0.1
        );
        break;
      case "grand":
        tl.fromTo(
          img,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
          0.1
        );
        break;
      default: // fade
        tl.fromTo(
          img,
          { opacity: 0, y: 20, scale: 1.03 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" },
          0.1
        );
    }

    // Text slide up
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.3
    );

    return () => {
      tl.kill();
    };
  }, [revealType]);

  return (
    <div
      ref={stopRef}
      className="absolute top-0 flex h-full flex-col items-center"
      style={{
        left: `${position}%`,
        width: "100vw",
        transform: "translateX(-50%)",
        paddingTop: "8vh",
      }}
    >
      {/* Stop marker on the road */}
      <div
        ref={markerRef}
        className="absolute z-30 flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          bottom: "14vh",
          background: theme.textAccent,
          boxShadow: `0 0 12px ${theme.textAccent}80`,
          opacity: 0,
        }}
      >
        <span className="text-[10px] font-bold text-white">{index}</span>
      </div>

      {/* Content card */}
      <div className="flex max-w-lg flex-col items-center gap-4 px-4 sm:max-w-xl">
        {/* Image - bigger with soft edges */}
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{
            height: "35vh",
            width: "min(85vw, 420px)",
            opacity: 0,
            border: `2px solid ${theme.border}`,
            boxShadow: theme.glow,
            maskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 88%, transparent 100%)",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 85vw, 480px"
            loading="lazy"
          />

          {/* Grand reveal: gold border with corner accents */}
          {isGrand && (
            <>
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  border: "3px solid var(--gold)",
                  boxShadow:
                    "inset 0 0 20px rgba(201,169,110,0.2), 0 0 30px rgba(201,169,110,0.3)",
                }}
              />
              {/* Corner accents */}
              {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
                (pos) => (
                  <div
                    key={pos}
                    className={`pointer-events-none absolute ${pos}`}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderColor: "var(--gold)",
                      borderWidth: pos.includes("top") ? "3px 0 0 0" : "0 0 3px 0",
                      ...(pos.includes("left")
                        ? { borderLeftWidth: "3px" }
                        : { borderRightWidth: "3px" }),
                    }}
                  />
                )
              )}
            </>
          )}

          {/* Ch5: soft radial glow frame */}
          {isCh5 && (
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow:
                  "inset 0 0 40px rgba(57,73,171,0.3), 0 0 40px rgba(57,73,171,0.2)",
              }}
            />
          )}
        </div>

        {/* Desktop: slightly larger */}
        <style jsx>{`
          @media (min-width: 768px) {
            div[data-image-container] {
              height: 40vh;
              width: min(90vw, 480px);
            }
          }
        `}</style>

        {/* Text */}
        <div
          ref={textRef}
          className="text-center"
          style={{ opacity: 0 }}
        >
          <p
            className="mb-1 text-xs uppercase tracking-[0.2em]"
            style={{ color: theme.textAccent }}
          >
            {subtitle}
          </p>
          <h3
            className="mb-2 text-xl sm:text-2xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: isCh5 ? "rgba(255,255,255,0.9)" : "var(--charcoal)",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed sm:text-base"
            style={{
              color: isCh5 ? "rgba(255,255,255,0.7)" : "var(--charcoal-light)",
            }}
          >
            {description}
          </p>

          {/* Ch5 distance badge */}
          {isCh5 && (
            <div
              className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span>7,200 km apart</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
