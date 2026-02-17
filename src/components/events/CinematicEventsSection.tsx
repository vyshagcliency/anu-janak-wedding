"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENTS } from "@/data/events";
import CinematicSky, { type CinematicSkyHandle } from "./CinematicSky";
import CinematicParticles, {
  type CinematicParticlesHandle,
} from "./CinematicParticles";
import CinematicEventMoment, {
  type CinematicEventMomentHandle,
} from "./CinematicEventMoment";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicEventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<CinematicSkyHandle>(null);
  const particlesRef = useRef<CinematicParticlesHandle>(null);
  const momentRefs = useRef<(CinematicEventMomentHandle | null)[]>([]);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  const setMomentRef = useCallback(
    (index: number) => (ref: CinematicEventMomentHandle | null) => {
      momentRefs.current[index] = ref;
    },
    []
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      scrub: 0.8,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    // rAF loop for imperative updates
    const tick = () => {
      const p = progressRef.current;

      // Header fade out during first 6% of progress (fully gone before Sundowner at 0.08)
      if (headerRef.current) {
        const headerOpacity = Math.max(0, 1 - p / 0.06);
        headerRef.current.style.opacity = String(headerOpacity);
        headerRef.current.style.transform = `translateY(${-p * 300}px)`;
        headerRef.current.style.display =
          headerOpacity <= 0 ? "none" : "flex";
      }

      skyRef.current?.update(p);
      particlesRef.current?.update(p);
      momentRefs.current.forEach((ref) => ref?.update(p));

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      trigger.kill();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      {/* Sky background */}
      <CinematicSky ref={skyRef} />

      {/* Particle layer */}
      <CinematicParticles ref={particlesRef} />

      {/* Section header — fades out as first event appears */}
      <div
        ref={headerRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      >
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "#E8D5B0", opacity: 0.7 }}
        >
          Scroll to explore
        </p>
        <h2
          className="font-heading text-center"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#FAF7F2",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            letterSpacing: "0.05em",
          }}
        >
          The Evening Unfolds
        </h2>
        <div
          className="cinematic-rule mt-4"
          style={{ width: "60px", opacity: 0.5 }}
        />
      </div>

      {/* Event moments */}
      <div className="absolute inset-0 z-20">
        {EVENTS.map((event, i) => (
          <CinematicEventMoment
            key={event.id}
            ref={setMomentRef(i)}
            event={event}
            index={i}
            isLast={i === EVENTS.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
