"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Position as percentage of total timeline width (0-100) */
  position: number;
  /** Visual style variant */
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
      className="absolute top-0 flex h-full flex-col items-center justify-center"
      style={{
        left: `${position}%`,
        width: "100vw",
        transform: "translateX(-50%)",
      }}
    >
      {/* Stop marker on the road */}
      <div
        ref={markerRef}
        className="absolute z-30 flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          bottom: "14vh",
          background: "var(--gold)",
          boxShadow: "0 0 12px rgba(201, 169, 110, 0.6)",
          opacity: 0,
        }}
      >
        <span className="text-[10px] font-bold text-white">{index}</span>
      </div>

      {/* Content card */}
      <div className="flex max-w-sm flex-col items-center gap-4 px-6 sm:max-w-md">
        {/* Image */}
        <div
          ref={imageRef}
          className="relative h-48 w-72 overflow-hidden rounded-xl shadow-lg sm:h-56 sm:w-80"
          style={{ opacity: 0 }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="320px"
            loading="lazy"
          />
          {revealType === "grand" && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl border-2"
              style={{ borderColor: "var(--gold)" }}
            />
          )}
        </div>

        {/* Text */}
        <div
          ref={textRef}
          className="text-center"
          style={{ opacity: 0 }}
        >
          <p
            className="mb-1 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--gold)" }}
          >
            {subtitle}
          </p>
          <h3
            className="mb-2 text-xl sm:text-2xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: "var(--charcoal)",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--charcoal-light)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
