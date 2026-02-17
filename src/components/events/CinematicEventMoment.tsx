"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
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

// Stagger offsets for element reveal within each event's range
const ELEMENT_STAGGER = [
  0.00, // date
  0.02, // title
  0.04, // rule
  0.06, // venue
  0.08, // address
  0.10, // dress code
  0.12, // color accents
  0.14, // map link / closing
];

const ELEMENT_FADE_DURATION = 0.04;

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

const CinematicEventMoment = forwardRef<CinematicEventMomentHandle, Props>(
  function CinematicEventMoment({ event, index, isLast }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const ruleRef = useRef<HTMLDivElement>(null);

    const range = EVENT_PROGRESS_RANGES[index];
    const style = TEXT_STYLES[event.timeOfDay] || TEXT_STYLES.evening;

    // Compute element visibility within the event's sub-range
    function getElementProgress(
      progress: number,
      elementIndex: number,
      range: EventProgressRange
    ): { opacity: number; translateY: number } {
      const rangeSpan = range.end - range.start;
      const elementStart =
        range.start + (ELEMENT_STAGGER[elementIndex] / 0.25) * rangeSpan * 0.4;
      const elementFullyIn = elementStart + ELEMENT_FADE_DURATION * (rangeSpan / 0.25);

      // Fade out starts when event visibility starts dropping
      const fadeOutStart = range.peak + (range.end - range.peak) * 0.3;
      const fadeOutEnd = range.end;

      if (progress < elementStart) {
        return { opacity: 0, translateY: 20 };
      }

      if (progress < elementFullyIn) {
        const t = (progress - elementStart) / (elementFullyIn - elementStart);
        return { opacity: t, translateY: 20 * (1 - t) };
      }

      if (progress > fadeOutStart) {
        const t = Math.min(
          1,
          (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
        );
        return { opacity: 1 - t, translateY: -20 * t };
      }

      return { opacity: 1, translateY: 0 };
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

        // Update each staggered element
        elementsRef.current.forEach((el, i) => {
          if (!el) return;
          const { opacity, translateY } = getElementProgress(
            progress,
            i,
            range
          );
          el.style.opacity = String(opacity);
          el.style.transform = `translateY(${translateY}px)`;
        });

        // Animate rule width
        if (ruleRef.current) {
          const { opacity } = getElementProgress(progress, 2, range);
          ruleRef.current.style.width = `${opacity * 100}%`;
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
        {/* Date & Time */}
        <div
          ref={setElementRef(0)}
          className="cinematic-date mb-3 opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          {event.date} &middot; {event.time}
        </div>

        {/* Title */}
        <div
          ref={setElementRef(1)}
          className="cinematic-event-title mb-4 opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          {event.title}
        </div>

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
          style={{ willChange: "transform, opacity" }}
        >
          {event.venue}
        </div>

        {/* Venue Address */}
        <div
          ref={setElementRef(4)}
          className="cinematic-venue-address mb-3 opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          {event.venueAddress}
        </div>

        {/* Dress Code */}
        <div
          ref={setElementRef(5)}
          className="cinematic-dresscode mb-4 opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          {event.dressCode}
        </div>

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
    );
  }
);

export default CinematicEventMoment;
