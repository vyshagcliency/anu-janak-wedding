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
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(248,244,238,0.7)",
              marginBottom: 8,
            }}
          >
            {event.date}
          </p>

          {event.subEvents && event.subEvents.length > 0 ? (
            <div style={{ marginBottom: 4 }}>
              {event.subEvents.map((sub, si) => (
                <div key={si} style={{ marginBottom: si < event.subEvents!.length - 1 ? 18 : 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      color: "#F8F4EE",
                      marginBottom: 4,
                    }}
                  >
                    {sub.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.72rem",
                      letterSpacing: "0.04em",
                      color: "rgba(248,244,238,0.55)",
                      marginBottom: 3,
                    }}
                  >
                    {sub.venue}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.14em",
                      color: accentColor,
                      marginBottom: sub.venueMapUrl ? 4 : 0,
                    }}
                  >
                    {sub.time}
                  </p>
                  {sub.venueMapUrl && (
                    <a
                      href={sub.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.55rem",
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
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.75rem",
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
                  fontSize: "0.82rem",
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
            </>
          )}

          {/* Dress Code & Color Palette */}
          <div style={{ marginTop: 28 }}>
            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(248,244,238,0.5)",
                marginBottom: 6,
              }}
            >
              Dress Code
            </p>
            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.04em",
                color: "#F8F4EE",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {event.dressCode}
            </p>

            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(248,244,238,0.5)",
                marginBottom: 8,
              }}
            >
              Color Palette
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {event.colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: color.hex,
                      border: "1px solid rgba(248,244,238,0.2)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.62rem",
                      color: "rgba(248,244,238,0.65)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
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

      {/* ── Mobile: horizontal swipe carousel ── */}
      <section
        className="luxury-event-gallery-mobile"
        style={{
          display: "none", // overridden to block by globals.css on mobile
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
        data-event-id={`${event.id}-mobile`}
      >
        <EventRoomBackground timeOfDay={event.timeOfDay} />

        {/* Info panel — top left */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 24,
            right: 24,
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 10,
              opacity: 0.9,
            }}
          >
            0{index + 1} &mdash; {event.date}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
              fontWeight: 400,
              color: "#F8F4EE",
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            {event.title}
          </h2>
          {event.subEvents && event.subEvents.length > 0 ? (
            <div>
              {event.subEvents.map((sub, si) => (
                <div key={si} style={{ marginBottom: si < event.subEvents!.length - 1 ? 10 : 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      color: "#F8F4EE",
                      marginBottom: 2,
                    }}
                  >
                    {sub.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      color: accentColor,
                    }}
                  >
                    {sub.time} &middot; {sub.venue}
                  </p>
                  {sub.venueMapUrl && (
                    <a
                      href={sub.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: accentColor,
                        textDecoration: "none",
                        opacity: 0.75,
                        display: "inline-block",
                      }}
                    >
                      Map &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: accentColor,
                  marginBottom: 4,
                }}
              >
                {event.time} &middot; {event.venue}
              </p>
              <a
                href={event.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: accentColor,
                  textDecoration: "none",
                  opacity: 0.75,
                  marginBottom: 12,
                  display: "inline-block",
                }}
              >
                Map &rarr;
              </a>
            </>
          )}

        </div>

        {/* Horizontal swipe track */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            paddingTop: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              paddingLeft: 24,
              paddingRight: 40,
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              width: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="mobile-swipe-track"
          >
            {event.photos.map((src, photoIndex) => (
              <div
                key={photoIndex}
                style={{
                  flexShrink: 0,
                  width: "75vw",
                  maxWidth: 280,
                  backgroundColor: "#F8F4EE",
                  padding: "10px 10px 36px 10px",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.2), 0 14px 32px rgba(0,0,0,0.28)",
                  transform: `rotate(${getPhotoTilt(photoIndex)}deg)`,
                  scrollSnapAlign: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <Image
                    src={src}
                    alt={`${event.title} — photo ${photoIndex + 1}`}
                    fill
                    sizes="75vw"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}

            {/* Style guide card — last in track */}
            <div
              style={{
                flexShrink: 0,
                width: "75vw",
                maxWidth: 280,
                backgroundColor: "#F8F4EE",
                padding: "10px 10px 36px 10px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2), 0 14px 32px rgba(0,0,0,0.28)",
                transform: "rotate(-1.2deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "center",
              }}
            >
              <button
                onClick={openAttire}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  padding: "40px 24px",
                  width: "100%",
                }}
              >
                <div style={{ width: 32, height: 1, background: accentColor, opacity: 0.7 }} />
                <p
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "#2C2C2C",
                    letterSpacing: "0.06em",
                    textAlign: "center",
                    lineHeight: 1.25,
                  }}
                >
                  Style<br />Guide
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "0.56rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#5A5A5A",
                  }}
                >
                  Tap to explore
                </p>
                <div style={{ width: 32, height: 1, background: accentColor, opacity: 0.7 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Dress Code & Color Palette — bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: "14px 24px 20px",
            background:
              "linear-gradient(to top, rgba(13,10,8,0.85) 0%, rgba(13,10,8,0.5) 70%, transparent 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(248,244,238,0.45)",
                  marginBottom: 3,
                }}
              >
                Dress Code
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.65rem",
                  color: "#F8F4EE",
                  letterSpacing: "0.03em",
                  lineHeight: 1.4,
                }}
              >
                {event.dressCode}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16 }}>
              {event.colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                    border: "1px solid rgba(248,244,238,0.25)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
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
