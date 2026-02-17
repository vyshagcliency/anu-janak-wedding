"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WeddingEvent } from "@/data/events";
import EventRoomBackground from "./EventRoomBackground";
import InstantFilmPrint from "./InstantFilmPrint";
import StyleGuideCard from "./StyleGuideCard";
import AttireOverlay from "./AttireOverlay";

gsap.registerPlugin(ScrollTrigger);

// Per-event accent colours
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
    // Mobile: no horizontal scroll — let it flow vertically
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Let layout settle before measuring
    const init = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxX = trackWidth - viewportWidth + 120; // 120px end padding

      // Pin section + drive horizontal scroll
      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: true,
        scrub: 1.4,
        start: "top top",
        end: `+=${maxX}`,
        onUpdate: (self) => {
          gsap.set(track, { x: -self.progress * maxX });

          // Reveal each print as it approaches the centre of the screen
          printRefs.current.forEach((el, i) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const centre = viewportWidth / 2;
            const distFromCentre = Math.abs(rect.left + rect.width / 2 - centre);
            const revealRadius = viewportWidth * 0.75;
            // 0 = outside reveal zone, 1 = fully in view
            const t = Math.max(0, Math.min(1, 1 - distFromCentre / revealRadius));
            el.style.opacity = String(0.05 + t * 0.95);
            el.style.transform = `rotate(${getPhotoTilt(i)}deg) scale(${0.88 + t * 0.12}) translateY(${(1 - t) * 24}px)`;
          });

          // Reveal style card at end
          if (styleCardRef.current) {
            const rect = styleCardRef.current.getBoundingClientRect();
            const t = Math.max(0, Math.min(1, 1 - Math.abs(rect.left + rect.width / 2 - viewportWidth / 2) / (viewportWidth * 0.6)));
            styleCardRef.current.style.opacity = String(t);
          }
        },
      });

      // Animate info panel in when section first pins
      if (infoPanelRef.current) {
        gsap.fromTo(
          infoPanelRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      return trigger;
    };

    const raf = requestAnimationFrame(() => {
      const trigger = init();
      return () => trigger?.kill();
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Full-screen pinned gallery section */}
      <section
        ref={sectionRef}
        className="luxury-event-gallery relative w-full overflow-hidden"
        style={{ height: "100vh" }}
        data-event-id={event.id}
      >
        {/* Cinematic room atmosphere */}
        <EventRoomBackground timeOfDay={event.timeOfDay} />

        {/* Event info panel — left side, overlaid on background */}
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
          }}
        >
          {/* Event number */}
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
            0{index + 1} &mdash; {event.timeOfDay === "sunset" ? "Afternoon" : event.timeOfDay === "night" ? "Evening" : event.timeOfDay === "morning" ? "Morning" : "Evening"}
          </p>

          {/* Event title */}
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

          {/* Subtitle */}
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

          {/* Gold rule */}
          <div
            style={{
              width: 48,
              height: 1,
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              marginBottom: 28,
            }}
          />

          {/* Date + time */}
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

          {/* Venue */}
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

          {/* Map link */}
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
              transition: "opacity 0.2s",
            }}
          >
            View Map
          </a>
        </div>

        {/* Horizontal gallery track */}
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
          {/* Photo prints */}
          {event.photos.map((src, photoIndex) => (
            <div
              key={photoIndex}
              ref={(el) => {
                printRefs.current[photoIndex] = el;
              }}
              style={{
                opacity: photoIndex === 0 ? 0.9 : 0.05,
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

          {/* Style Guide card at the end */}
          <div
            ref={styleCardRef}
            style={{ opacity: 0 }}
          >
            <StyleGuideCard onClick={openAttire} accentColor={accentColor} />
          </div>
        </div>

        {/* Scroll hint — fades out after first scroll movement */}
        <div
          className="scroll-hint"
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

      {/* Mobile layout — vertical stacked gallery */}
      <section
        className="luxury-event-gallery-mobile"
        style={{
          display: "none",
          position: "relative",
          minHeight: "100vh",
          padding: "64px 24px 80px",
        }}
        data-event-id={`${event.id}-mobile`}
      >
        <EventRoomBackground timeOfDay={event.timeOfDay} />

        {/* Event info */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            marginBottom: 40,
          }}
        >
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

        {/* Mobile photo grid — 2-column masonry-like */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {event.photos.map((src, photoIndex) => (
            <div
              key={photoIndex}
              className="film-print-mobile"
              style={{
                backgroundColor: "#F8F4EE",
                padding: "8px 8px 28px 8px",
                boxShadow:
                  "0 3px 6px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)",
                transform: `rotate(${getPhotoTilt(photoIndex)}deg)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: photoIndex % 3 !== 1 ? "3/4" : "4/3",
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <InstantFilmPrint
                  src={src}
                  alt={`${event.title} — photo ${photoIndex + 1}`}
                  index={photoIndex}
                  priority={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Style guide button (mobile) */}
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

      {/* Attire overlay (shared between desktop + mobile) */}
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

// Helper — deterministic tilt value
function getPhotoTilt(index: number): number {
  const tilts = [-2.1, 1.4, -1.8, 2.2, -0.9, 1.7, -2.4, 1.1];
  return tilts[index % tilts.length];
}
