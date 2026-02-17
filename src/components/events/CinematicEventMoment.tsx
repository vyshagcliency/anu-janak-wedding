"use client";

import { useRef, useImperativeHandle, forwardRef, useMemo } from "react";
import {
  EVENT_PROGRESS_RANGES,
  getEventVisibility,
  type EventProgressRange,
} from "./cinematic-types";
import CinematicColorAccents from "./CinematicColorAccents";
import type { WeddingEvent } from "@/data/events";

export interface CinematicEventMomentHandle {
  update(progress: number): void;
}

interface Props {
  event: WeddingEvent;
  index: number;
  isLast: boolean;
}

// Stagger delays in ms after the event first becomes visible
// Each element waits this long before it starts typing
const ELEMENT_DELAY_MS = [
  0,    // date
  300,  // title (starts after date begins)
  800,  // rule
  1200, // venue
  1600, // address
  2000, // dress code
  2500, // color accents
  3000, // map link
];

// Typing speed: ms per character
const MS_PER_CHAR_DEFAULT = 35;
const MS_PER_CHAR_TITLE = 55; // title types slower for drama

// Text styling per event type (light vs dark sky)
const TEXT_STYLES: Record<
  string,
  { color: string; shadow: string; ruleColor: string }
> = {
  sunset: {
    color: "#FAF7F2",
    shadow: "0 1px 12px rgba(0,0,0,0.5)",
    ruleColor: "#FFD700",
  },
  night: {
    color: "#FAF7F2",
    shadow: "0 1px 12px rgba(0,0,0,0.5)",
    ruleColor: "#C9A96E",
  },
  morning: {
    color: "#2C2C2C",
    shadow: "0 1px 8px rgba(255,255,255,0.3)",
    ruleColor: "#C9A96E",
  },
  evening: {
    color: "#FAF7F2",
    shadow: "0 1px 12px rgba(0,0,0,0.5)",
    ruleColor: "#C9A96E",
  },
};

// Which element indices use typewriter effect (text elements only)
const TYPEWRITER_INDICES = new Set([0, 1, 3, 4, 5]);

// ─── Per-event background images ───
const EVENT_BG_IMAGES: Record<string, string> = {
  sundowner: "/images/events/sundowner/bg.webp",
  sangeet: "/images/events/sangeet/bg.webp",
  wedding: "/images/hero/img3.jpeg",
  reception: "/images/events/reception/bg.webp",
};

// ─── Per-event overlay gradients (ensure text readability) ───
const EVENT_OVERLAYS: Record<string, string> = {
  sundowner:
    "linear-gradient(180deg, rgba(80,30,10,0.55) 0%, rgba(50,15,5,0.65) 100%)",
  sangeet:
    "linear-gradient(180deg, rgba(20,10,60,0.6) 0%, rgba(40,20,80,0.65) 100%)",
  wedding:
    "linear-gradient(180deg, rgba(245,235,220,0.4) 0%, rgba(230,215,190,0.45) 100%)",
  reception:
    "linear-gradient(180deg, rgba(10,10,30,0.6) 0%, rgba(30,20,15,0.55) 100%)",
};

const CinematicEventMoment = forwardRef<CinematicEventMomentHandle, Props>(
  function CinematicEventMoment({ event, index, isLast }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const ruleRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);

    // Auto-type state: timestamp when this event first became visible
    const eventVisibleSinceRef = useRef<number | null>(null);
    // Track per-element completion for cursor
    const elementDoneRef = useRef<boolean[]>(new Array(8).fill(false));

    const range = EVENT_PROGRESS_RANGES[index];
    const style = TEXT_STYLES[event.timeOfDay] || TEXT_STYLES.evening;

    // Full text strings for typewriter elements
    const textStrings = useMemo(
      () => [
        `${event.date} \u00B7 ${event.time}`,
        event.title,
        "", // rule
        event.venue,
        event.venueAddress,
        event.dressCode,
        "", // color accents
        "", // map link
      ],
      [event]
    );

    // Background image + overlay for this event
    const bgImage = EVENT_BG_IMAGES[event.id] || EVENT_BG_IMAGES.wedding;
    const bgOverlay = EVENT_OVERLAYS[event.id] || EVENT_OVERLAYS.wedding;
    const bgBlur = event.id === "wedding" ? "blur(12px)" : "none";

    // Fade out region: computed once
    function getFadeOutT(progress: number): number {
      const fadeOutStart = range.peak + (range.end - range.peak) * 0.3;
      if (progress <= fadeOutStart) return 0;
      return Math.min(1, (progress - fadeOutStart) / (range.end - fadeOutStart));
    }

    useImperativeHandle(ref, () => ({
      update(progress: number) {
        const visibility = getEventVisibility(progress, range);

        if (!containerRef.current) return;

        if (visibility <= 0) {
          containerRef.current.style.display = "none";
          // Reset auto-type when event scrolls away
          eventVisibleSinceRef.current = null;
          elementDoneRef.current.fill(false);
          return;
        }

        containerRef.current.style.display = "flex";

        // Start timer on first visibility
        const now = performance.now();
        if (eventVisibleSinceRef.current === null) {
          eventVisibleSinceRef.current = now;
        }
        const elapsed = now - eventVisibleSinceRef.current;

        const fadeOutT = getFadeOutT(progress);

        // Background atmosphere fade
        if (bgRef.current) {
          const bgOpacity = Math.min(visibility * 3, 1) * 0.45;
          bgRef.current.style.opacity = String(
            fadeOutT > 0 ? bgOpacity * (1 - fadeOutT) : bgOpacity
          );
        }

        // Update each element
        elementsRef.current.forEach((el, i) => {
          if (!el) return;

          const elementElapsed = elapsed - ELEMENT_DELAY_MS[i];

          if (TYPEWRITER_INDICES.has(i)) {
            const fullText = textStrings[i];
            const msPerChar = i === 1 ? MS_PER_CHAR_TITLE : MS_PER_CHAR_DEFAULT;

            if (elementElapsed < 0) {
              // Not started yet
              el.textContent = "";
              el.style.opacity = "0";
              el.style.transform = "translateY(12px)";
              elementDoneRef.current[i] = false;
              return;
            }

            const charsToShow = Math.min(
              fullText.length,
              Math.floor(elementElapsed / msPerChar)
            );
            const visibleText = fullText.substring(0, charsToShow);
            const isDone = charsToShow >= fullText.length;

            if (el.textContent !== visibleText) {
              el.textContent = visibleText;
            }

            elementDoneRef.current[i] = isDone;

            // Fade in when first char appears, fade out on scroll-away
            const showOpacity = charsToShow > 0 ? 1 : 0;
            const opacity = fadeOutT > 0 ? showOpacity * (1 - fadeOutT) : showOpacity;
            const translateY = fadeOutT > 0 ? -20 * fadeOutT : charsToShow > 0 ? 0 : 12;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px)`;
          } else {
            // Non-typewriter: time-based fade in
            if (elementElapsed < 0) {
              el.style.opacity = "0";
              el.style.transform = "translateY(20px)";
              return;
            }

            const fadeInDuration = 400; // ms
            const fadeInT = Math.min(1, elementElapsed / fadeInDuration);
            const opacity = fadeOutT > 0 ? fadeInT * (1 - fadeOutT) : fadeInT;
            const translateY =
              fadeOutT > 0 ? -20 * fadeOutT : 20 * (1 - fadeInT);
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px)`;
          }
        });

        // Rule: time-based width expansion
        if (ruleRef.current) {
          const ruleElapsed = elapsed - ELEMENT_DELAY_MS[2];
          if (ruleElapsed < 0) {
            ruleRef.current.style.width = "0%";
            ruleRef.current.style.opacity = "0";
          } else {
            const expandDuration = 600;
            const expandT = Math.min(1, ruleElapsed / expandDuration);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - expandT, 3);
            const opacity = fadeOutT > 0 ? eased * (1 - fadeOutT) : eased;
            ruleRef.current.style.width = `${eased * 100}%`;
            ruleRef.current.style.opacity = String(opacity);
          }
        }
      },
    }));

    const setElementRef = (i: number) => (el: HTMLDivElement | null) => {
      elementsRef.current[i] = el;
    };

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{
          display: "none",
          color: style.color,
          textShadow: style.shadow,
        }}
      >
        {/* Layer 1: Full-bleed background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bgRef}
          src={bgImage}
          alt=""
          aria-hidden
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{
            opacity: 0,
            transform: "scale(1.05)",
            filter: bgBlur,
            willChange: "opacity",
          }}
        />

        {/* Layer 2: Per-event gradient overlay for text readability */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: bgOverlay }}
        />

        {/* Layer 3: Subtle vignette for depth */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center max-w-lg">
          {/* Date & Time */}
          <div
            ref={setElementRef(0)}
            className="cinematic-date mb-3 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.2em",
            }}
          />

          {/* Title */}
          <div
            ref={setElementRef(1)}
            className="cinematic-event-title mb-4 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.2em",
            }}
          />

          {/* Gold Rule */}
          <div className="w-full flex justify-center mb-5">
            <div
              ref={(el) => {
                ruleRef.current = el;
                setElementRef(2)(el);
              }}
              className="cinematic-rule"
              style={{ width: "0%", willChange: "width, opacity" }}
            />
          </div>

          {/* Venue Name */}
          <div
            ref={setElementRef(3)}
            className="cinematic-venue mb-1 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.4em",
            }}
          />

          {/* Venue Address */}
          <div
            ref={setElementRef(4)}
            className="cinematic-venue-address mb-3 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.2em",
            }}
          />

          {/* Dress Code */}
          <div
            ref={setElementRef(5)}
            className="cinematic-dresscode mb-4 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.4em",
            }}
          />

          {/* Color Accents */}
          <div
            ref={setElementRef(6)}
            className="mb-4 opacity-0"
            style={{ willChange: "transform, opacity" }}
          >
            <CinematicColorAccents colors={event.colors} />
          </div>

          {/* Map Link or Closing */}
          <div
            ref={setElementRef(7)}
            className="opacity-0 pointer-events-auto"
            style={{ willChange: "transform, opacity" }}
          >
            {isLast ? (
              <div className="flex flex-col items-center gap-2">
                <a
                  href={event.venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cinematic-map-link"
                  style={{ color: style.ruleColor }}
                >
                  View on Maps
                </a>
                <div className="mt-4 cinematic-venue opacity-60">
                  See you there
                </div>
                <div
                  className="cinematic-rule mt-1"
                  style={{ width: "40px", opacity: 0.4 }}
                />
              </div>
            ) : (
              <a
                href={event.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cinematic-map-link"
                style={{ color: style.ruleColor }}
              >
                View on Maps
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default CinematicEventMoment;
