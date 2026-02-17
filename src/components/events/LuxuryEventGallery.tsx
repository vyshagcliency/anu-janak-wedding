"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WeddingEvent } from "@/data/events";
import EventRoomBackground from "./EventRoomBackground";
import InstantFilmPrint from "./InstantFilmPrint";
import StyleGuideCard from "./StyleGuideCard";
import AttireOverlay from "./AttireOverlay";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_COLORS: Record<string, string> = {
  sunset: "#D4880A",
  night: "#C9A96E",
  morning: "#C9A96E",
  evening: "#C9A96E",
};

interface Props {
  event: WeddingEvent;
  index: number;
}

export default function LuxuryEventGallery({ event, index }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const printRefs = useRef<(HTMLDivElement | null)[]>([]);
  const styleCardRef = useRef<HTMLDivElement>(null);
  const [attireOpen, setAttireOpen] = useState(false);

  const accentColor = ACCENT_COLORS[event.timeOfDay];
  const openAttire = useCallback(() => setAttireOpen(true), []);
  const closeAttire = useCallback(() => setAttireOpen(false), []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Store refs for cleanup — the rAF callback return value is ignored,
    // so we MUST store these outside and kill them in the useEffect cleanup.
    let mainTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;
    let rafId: number;

    rafId = requestAnimationFrame(() => {
      // Read info panel width from DOM so maxX accounts for the left offset
      const infoPanel = infoPanelRef.current;
      const infoPanelWidth = infoPanel ? infoPanel.offsetWidth : 280;
      const trackScrollWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;

      // The track's left edge sits at `infoPanelWidth` px from viewport left.
      // We need to translate the track leftward until its RIGHT edge reaches
      // the viewport's right edge.
      // maxX = (infoPanelWidth + trackScrollWidth) - viewportWidth
      const maxX = Math.max(0, infoPanelWidth + trackScrollWidth - viewportWidth);

      mainTrigger = ScrollTrigger.create({
        trigger: section,
        pin: true,
        scrub: 1.4,
        start: "top top",
        end: `+=${maxX}`,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(track, { x: -p * maxX });

          // Progress-driven photo reveal — no getBoundingClientRect polling
          // Each photo occupies an equal slice of the progress range
          const photoCount = printRefs.current.length;
          printRefs.current.forEach((el, i) => {
            if (!el) return;
            // Each photo is fully visible in the centre of its slice
            const sliceCenter = (i + 0.5) / (photoCount + 1);
            const dist = Math.abs(p - sliceCenter);
            const halfWindow = 0.35;
            const t = Math.max(0, Math.min(1, 1 - dist / halfWindow));
            el.style.opacity = String(0.06 + t * 0.94);
            el.style.transform = `rotate(${getPhotoTilt(i)}deg) scale(${
              0.88 + t * 0.12
            }) translateY(${(1 - t) * 24}px)`;
          });

          // Style card reveals at the end
          if (styleCardRef.current) {
            const t = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
            styleCardRef.current.style.opacity = String(t);
          }
        },
      });

      // Reveal info panel immediately — no nested ScrollTrigger
      if (infoPanelRef.current) {
        gsap.set(infoPanelRef.current, { opacity: 1, y: 0 });
      }
    });

    // Cleanup: cancel the rAF if it hasn't fired yet, kill trigger if it has
    return () => {
      cancelAnimationFrame(rafId);
      mainTrigger?.kill();
    };
  }, []);

  return (
    <>
      {/* ── Desktop: full-screen pinned horizontal gallery ── */}
      <section
        ref={sectionRef}
        className="luxury-event-gallery relative w-full overflow-hidden"
        style={{ height: "100vh" }}
        data-event-id={event.id}
      >
        <EventRoomBackground timeOfDay={event.timeOfDay} />

        {/* Info panel */}
        <div
          ref={infoPanelRef}
          className="event-info-panel"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "clamp(220px, 22vw, 300px)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 40px 48px 48px",
            pointerEvents: "none",
            // Start hidden; set to visible in useEffect (avoids flash)
            opacity: 0,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 20,
              opacity: 0.8,
            }}
          >
            0{index + 1} &mdash;{" "}
            {event.timeOfDay === "sunset"
              ? "Afternoon"
              : event.timeOfDay === "morning"
              ? "Morning"
              : "Evening"}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.8rem)",
              fontWeight: 400,
              color: "#F8F4EE",
              lineHeight: 1.15,
              letterSpacing: "0.03em",
              marginBottom: 12,
            }}
          >
            {event.title}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.75rem",
              fontStyle: "italic",
              color: "rgba(248,244,238,0.5)",
              letterSpacing: "0.06em",
              marginBottom: 28,
            }}
          >
            {event.subtitle}
          </p>

          <div
            style={{
              width: 48,
              height: 1,
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              marginBottom: 28,
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(248,244,238,0.7)",
              marginBottom: 8,
            }}
          >
            {event.date}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              color: accentColor,
              marginBottom: 20,
            }}
          >
            {event.time}
          </p>

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
              color: "rgba(248,244,238,0.55)",
              marginBottom: 4,
            }}
          >
            {event.venue}
          </p>

          <a
            href={event.venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              textDecoration: "none",
              borderBottom: `1px solid ${accentColor}60`,
              paddingBottom: 2,
              pointerEvents: "auto",
              display: "inline-block",
              opacity: 0.85,
            }}
          >
            View Map
          </a>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="gallery-track"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "clamp(220px, 22vw, 300px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(60px, 8vw, 120px)",
            paddingLeft: "clamp(48px, 6vw, 96px)",
            paddingRight: "clamp(80px, 12vw, 160px)",
            willChange: "transform",
          }}
        >
          {event.photos.map((src, photoIndex) => (
            <div
              key={photoIndex}
              ref={(el) => {
                printRefs.current[photoIndex] = el;
              }}
              style={{
                opacity: photoIndex === 0 ? 0.9 : 0.06,
                transition: "none",
              }}
            >
              <InstantFilmPrint
                src={src}
                alt={`${event.title} — photo ${photoIndex + 1}`}
                index={photoIndex}
                priority={index === 0 && photoIndex < 2}
              />
            </div>
          ))}

          <div ref={styleCardRef} style={{ opacity: 0 }}>
            <StyleGuideCard onClick={openAttire} accentColor={accentColor} />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: 0.45,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,
              background: "rgba(248,244,238,0.5)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(248,244,238,0.7)",
            }}
          >
            Scroll
          </p>
        </div>
      </section>

      {/* ── Mobile: vertical scrollable gallery ── */}
      <section
        className="luxury-event-gallery-mobile"
        style={{
          display: "none", // overridden to block by CSS on mobile
          position: "relative",
          padding: "64px 20px 80px",
        }}
        data-event-id={`${event.id}-mobile`}
      >
        <EventRoomBackground timeOfDay={event.timeOfDay} />

        {/* Event info */}
        <div style={{ position: "relative", zIndex: 10, marginBottom: 36 }}>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 12,
            }}
          >
            0{index + 1}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(1.8rem, 8vw, 2.6rem)",
              fontWeight: 400,
              color: "#F8F4EE",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {event.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 16,
            }}
          >
            {event.date} &middot; {event.time}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.7rem",
              color: "rgba(248,244,238,0.55)",
              marginBottom: 6,
            }}
          >
            {event.venue}
          </p>
          <a
            href={event.venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              textDecoration: "none",
            }}
          >
            View Map &rarr;
          </a>
        </div>

        {/* 2-column photo grid — use Image directly (no InstantFilmPrint fixed widths) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {event.photos.map((src, photoIndex) => (
            <div
              key={photoIndex}
              style={{
                backgroundColor: "#F8F4EE",
                padding: "8px 8px 28px 8px",
                boxShadow:
                  "0 3px 6px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)",
                transform: `rotate(${getPhotoTilt(photoIndex)}deg)`,
              }}
            >
              {/* Responsive image area — fills the grid cell width */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: photoIndex % 3 !== 1 ? "3/4" : "4/3",
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <Image
                  src={src}
                  alt={`${event.title} — photo ${photoIndex + 1}`}
                  fill
                  sizes="45vw"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Style guide button */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <button
            onClick={openAttire}
            style={{
              background: "none",
              border: `1px solid ${accentColor}60`,
              color: accentColor,
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              padding: "14px 32px",
              cursor: "pointer",
            }}
          >
            Style Guide
          </button>
        </div>
      </section>

      <AttireOverlay
        isOpen={attireOpen}
        onClose={closeAttire}
        images={event.attireImages}
        eventTitle={event.title}
        dressCode={event.dressCode}
      />
    </>
  );
}

function getPhotoTilt(index: number): number {
  const tilts = [-2.1, 1.4, -1.8, 2.2, -0.9, 1.7, -2.4, 1.1];
  return tilts[index % tilts.length];
}
