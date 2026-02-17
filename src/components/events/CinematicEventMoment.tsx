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

// Stagger offsets (fraction of range span used for stagger region)
const ELEMENT_STAGGER = [
  0.00, // date
  0.03, // title
  0.06, // rule
  0.10, // venue
  0.13, // address
  0.16, // dress code
  0.19, // color accents
  0.22, // map link / closing
];

// How much of the range span each element takes to fully reveal
const ELEMENT_REVEAL_SPAN = 0.05;

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

const CinematicEventMoment = forwardRef<CinematicEventMomentHandle, Props>(
  function CinematicEventMoment({ event, index, isLast }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const ruleRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLDivElement>(null);

    const range = EVENT_PROGRESS_RANGES[index];
    const style = TEXT_STYLES[event.timeOfDay] || TEXT_STYLES.evening;

    // Pre-compute the full text strings for typewriter elements
    const textStrings = useMemo(
      () => [
        `${event.date} \u00B7 ${event.time}`, // date · time
        event.title,
        "", // rule (not typewriter)
        event.venue,
        event.venueAddress,
        event.dressCode,
        "", // color accents (not typewriter)
        "", // map link (not typewriter)
      ],
      [event]
    );

    function getElementProgress(
      progress: number,
      elementIndex: number,
      range: EventProgressRange
    ): { revealT: number; fadeOutT: number } {
      const rangeSpan = range.end - range.start;
      const staggerFraction = ELEMENT_STAGGER[elementIndex] ?? 0;
      const elementStart = range.start + staggerFraction * rangeSpan;
      const elementFullyIn = elementStart + ELEMENT_REVEAL_SPAN * rangeSpan;

      // Fade out region
      const fadeOutStart = range.peak + (range.end - range.peak) * 0.3;
      const fadeOutEnd = range.end;

      let revealT = 0;
      if (progress < elementStart) {
        revealT = 0;
      } else if (progress < elementFullyIn) {
        revealT = (progress - elementStart) / (elementFullyIn - elementStart);
      } else {
        revealT = 1;
      }

      let fadeOutT = 0;
      if (progress > fadeOutStart) {
        fadeOutT = Math.min(
          1,
          (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
        );
      }

      return { revealT, fadeOutT };
    }

    useImperativeHandle(ref, () => ({
      update(progress: number) {
        const visibility = getEventVisibility(progress, range);

        if (!containerRef.current) return;

        if (visibility <= 0) {
          containerRef.current.style.display = "none";
          return;
        }

        containerRef.current.style.display = "flex";

        // Background image fade
        if (bgImageRef.current) {
          // Fade in quickly, hold, fade out with event
          const bgOpacity = Math.min(visibility * 2, 1) * 0.25; // max 25% opacity
          bgImageRef.current.style.opacity = String(bgOpacity);
        }

        // Update each staggered element
        elementsRef.current.forEach((el, i) => {
          if (!el) return;
          const { revealT, fadeOutT } = getElementProgress(progress, i, range);

          if (TYPEWRITER_INDICES.has(i)) {
            // Typewriter: reveal characters progressively
            const fullText = textStrings[i];
            const charsToShow = Math.floor(revealT * fullText.length);
            const visibleText = fullText.substring(0, charsToShow);

            // Only update textContent if changed (avoid layout thrash)
            if (el.textContent !== visibleText) {
              el.textContent = visibleText;
            }

            // Show cursor blink while typing, hide when done
            if (revealT > 0 && revealT < 1) {
              el.style.borderRight = `2px solid ${style.ruleColor}`;
            } else {
              el.style.borderRight = "2px solid transparent";
            }

            // Fade out
            const opacity = fadeOutT > 0 ? 1 - fadeOutT : revealT > 0 ? 1 : 0;
            const translateY = fadeOutT > 0 ? -20 * fadeOutT : 0;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px)`;
          } else {
            // Non-typewriter: standard fade in/out
            const opacity =
              fadeOutT > 0 ? 1 - fadeOutT : revealT;
            const translateY =
              fadeOutT > 0
                ? -20 * fadeOutT
                : revealT < 1
                  ? 20 * (1 - revealT)
                  : 0;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px)`;
          }
        });

        // Animate rule width
        if (ruleRef.current) {
          const { revealT, fadeOutT } = getElementProgress(progress, 2, range);
          const width = revealT * 100;
          const opacity = fadeOutT > 0 ? 1 - fadeOutT : revealT;
          ruleRef.current.style.width = `${width}%`;
          ruleRef.current.style.opacity = String(opacity);
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
        {/* Background image with overlay */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 z-0"
          style={{
            opacity: 0,
            backgroundImage: `url(${event.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "opacity",
          }}
        >
          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                event.timeOfDay === "morning" || event.timeOfDay === "sunset"
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 100%)"
                  : "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Date & Time */}
          <div
            ref={setElementRef(0)}
            className="cinematic-date mb-3 opacity-0"
            style={{ willChange: "transform, opacity", minHeight: "1.2em" }}
          />

          {/* Title */}
          <div
            ref={setElementRef(1)}
            className="cinematic-event-title mb-4 opacity-0"
            style={{ willChange: "transform, opacity", minHeight: "1.2em" }}
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
            style={{ willChange: "transform, opacity", minHeight: "1.4em" }}
          />

          {/* Venue Address */}
          <div
            ref={setElementRef(4)}
            className="cinematic-venue-address mb-3 opacity-0"
            style={{ willChange: "transform, opacity", minHeight: "1.2em" }}
          />

          {/* Dress Code */}
          <div
            ref={setElementRef(5)}
            className="cinematic-dresscode mb-4 opacity-0"
            style={{ willChange: "transform, opacity", minHeight: "1.4em" }}
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
