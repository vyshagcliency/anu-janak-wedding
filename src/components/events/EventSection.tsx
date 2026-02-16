"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WeddingEvent } from "@/data/events";
import EventBackground from "./EventBackground";
import EventParticles from "./EventParticles";
import EventDetails from "./EventDetails";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_COLORS: Record<string, string> = {
  sunset: "#FF9800",
  night: "#FFD700",
  morning: "#C9A96E",
  evening: "#C9A96E",
};

interface Props {
  event: WeddingEvent;
  index: number;
}

export default function EventSection({ event, index }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const accentColor = ACCENT_COLORS[event.timeOfDay];
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const children = contentRef.current.children;
    const elements = Array.from(children);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "top 25%",
        toggleActions: "play none none reverse",
      },
    });

    elements.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        i * 0.12
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="event-section-offscreen relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background layer — z-0 */}
      <EventBackground bgImage={event.bgImage} timeOfDay={event.timeOfDay} />

      {/* Mood particles — z-5 */}
      <EventParticles timeOfDay={event.timeOfDay} />

      {/* Content layer — z-10 */}
      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 py-16 md:flex-row md:gap-12 ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Placeholder image slot */}
        <div className="flex w-full justify-center md:w-5/12">
          <div
            className="flex aspect-[3/4] w-full max-w-[320px] items-center justify-center rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "2px dashed rgba(255,255,255,0.15)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
            }}
          >
            <p className="text-sm text-white/30">Event Photo</p>
          </div>
        </div>

        {/* Text + details */}
        <div
          ref={contentRef}
          className="flex w-full flex-col items-center gap-5 text-center md:w-7/12 md:items-start md:text-left"
        >
          {/* Event title */}
          <h2
            className="text-3xl leading-tight sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: "white",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {event.title}
          </h2>

          {/* Date & time */}
          <p
            className="text-sm uppercase tracking-[0.2em] sm:text-base"
            style={{ color: accentColor }}
          >
            {event.date} &middot; {event.time}
          </p>

          {/* Venue quick line */}
          <p className="text-base text-white/70">{event.venue}</p>

          {/* Interactive detail cards */}
          <EventDetails event={event} accentColor={accentColor} />
        </div>
      </div>
    </section>
  );
}
