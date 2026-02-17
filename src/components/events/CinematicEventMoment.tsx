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
    color: "#2C2C2C",
    shadow: "0 1px 8px rgba(255,255,255,0.3)",
    ruleColor: "#C9A96E",
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

// ─── Premium CSS backgrounds per event ───
// Multi-layered gradients that give each event a distinct luxe atmosphere

const EVENT_BACKGROUNDS: Record<string, string[]> = {
  // Sundowner: warm golden hour, light rays, amber bokeh
  sunset: [
    "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(255,140,66,0.35) 0%, transparent 70%)",
    "radial-gradient(ellipse 40% 60% at 20% 70%, rgba(201,169,110,0.25) 0%, transparent 60%)",
    "radial-gradient(circle at 80% 80%, rgba(232,152,90,0.2) 0%, transparent 50%)",
    "radial-gradient(circle at 50% 20%, rgba(255,179,71,0.15) 0%, transparent 40%)",
    "linear-gradient(135deg, rgba(74,26,46,0.1) 0%, transparent 40%, rgba(232,152,90,0.08) 100%)",
  ],
  // Sangeet: deep glamorous night, jewel tones, disco shimmer
  night: [
    "radial-gradient(ellipse 50% 40% at 30% 25%, rgba(108,99,255,0.3) 0%, transparent 70%)",
    "radial-gradient(ellipse 45% 55% at 75% 60%, rgba(106,27,154,0.25) 0%, transparent 65%)",
    "radial-gradient(circle at 60% 15%, rgba(255,215,0,0.12) 0%, transparent 35%)",
    "radial-gradient(circle at 15% 80%, rgba(21,101,192,0.2) 0%, transparent 45%)",
    "radial-gradient(circle at 85% 85%, rgba(189,189,189,0.08) 0%, transparent 30%)",
    "linear-gradient(160deg, rgba(13,27,42,0.15) 0%, transparent 50%, rgba(74,63,138,0.1) 100%)",
  ],
  // Wedding: soft ethereal dawn, sacred golden light, petal softness
  morning: [
    "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,0.3) 0%, transparent 70%)",
    "radial-gradient(ellipse 50% 70% at 30% 60%, rgba(240,221,213,0.25) 0%, transparent 60%)",
    "radial-gradient(circle at 70% 25%, rgba(212,168,51,0.15) 0%, transparent 40%)",
    "radial-gradient(circle at 50% 80%, rgba(245,230,211,0.2) 0%, transparent 50%)",
    "linear-gradient(180deg, rgba(245,230,211,0.08) 0%, transparent 30%, rgba(232,213,176,0.06) 100%)",
  ],
  // Reception: midnight luxe, crystal refractions, gold champagne bubbles
  evening: [
    "radial-gradient(ellipse 40% 50% at 40% 35%, rgba(201,169,110,0.25) 0%, transparent 65%)",
    "radial-gradient(ellipse 50% 40% at 70% 65%, rgba(128,0,32,0.2) 0%, transparent 60%)",
    "radial-gradient(circle at 20% 20%, rgba(255,215,0,0.1) 0%, transparent 35%)",
    "radial-gradient(circle at 80% 15%, rgba(232,213,176,0.08) 0%, transparent 30%)",
    "radial-gradient(circle at 50% 90%, rgba(201,169,110,0.12) 0%, transparent 40%)",
    "linear-gradient(200deg, rgba(26,26,46,0.1) 0%, transparent 40%, rgba(74,14,14,0.06) 100%)",
  ],
};

const CinematicEventMoment = forwardRef<CinematicEventMomentHandle, Props>(
  function CinematicEventMoment({ event, index, isLast }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const ruleRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

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

    // Background layers
    const bgLayers = EVENT_BACKGROUNDS[event.timeOfDay] || EVENT_BACKGROUNDS.evening;
    const bgStyle = bgLayers.join(", ");

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
          const bgOpacity = Math.min(visibility * 3, 1) * 0.85;
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
              el.style.borderRight = "2px solid transparent";
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

            // Cursor: visible while typing, blinks briefly after done, then hides
            if (!isDone) {
              el.style.borderRight = `2px solid ${style.ruleColor}`;
            } else {
              const timeSinceDone =
                elementElapsed - fullText.length * msPerChar;
              // Blink for 600ms after completion, then hide
              if (timeSinceDone < 600) {
                el.style.borderRight =
                  Math.floor(timeSinceDone / 150) % 2 === 0
                    ? `2px solid ${style.ruleColor}`
                    : "2px solid transparent";
              } else {
                el.style.borderRight = "2px solid transparent";
              }
            }

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
        {/* Premium atmospheric background */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
          style={{
            opacity: 0,
            background: bgStyle,
            willChange: "opacity",
          }}
        />

        {/* Subtle vignette for depth */}
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
              paddingRight: "3px",
            }}
          />

          {/* Title */}
          <div
            ref={setElementRef(1)}
            className="cinematic-event-title mb-4 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.2em",
              paddingRight: "3px",
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
              paddingRight: "3px",
            }}
          />

          {/* Venue Address */}
          <div
            ref={setElementRef(4)}
            className="cinematic-venue-address mb-3 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.2em",
              paddingRight: "3px",
            }}
          />

          {/* Dress Code */}
          <div
            ref={setElementRef(5)}
            className="cinematic-dresscode mb-4 opacity-0"
            style={{
              willChange: "transform, opacity",
              minHeight: "1.4em",
              paddingRight: "3px",
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
