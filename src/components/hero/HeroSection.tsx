"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import ParallaxBackground from "./ParallaxBackground";
import EnvelopeReveal from "./EnvelopeReveal";
import MonogramReveal from "./MonogramReveal";
import CountdownTimer from "./CountdownTimer";
import StartJourneyCTA from "./StartJourneyCTA";

interface Props {
  onStartJourney: () => void;
}

export default function HeroSection({ onStartJourney }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeDone, setEnvelopeDone] = useState(false);

  useEffect(() => {
    // Small delay to allow loading screen to finish
    const timer = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleEnvelopeRevealed = useCallback(() => {
    setEnvelopeDone(true);
  }, []);

  // After envelope is done, animate hero content in
  useEffect(() => {
    if (!envelopeDone || !contentRef.current || !sectionRef.current) return;

    // Make section visible
    gsap.set(sectionRef.current, { opacity: 1 });

    const tl = gsap.timeline();

    // Background fades in
    tl.fromTo(
      sectionRef.current.querySelector(".parallax-bg-wrap"),
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // Monogram
    tl.fromTo(
      contentRef.current.querySelector(".hero-monogram"),
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
      "-=0.3"
    );

    // Names
    tl.fromTo(
      contentRef.current.querySelector(".hero-names"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );

    // Date
    tl.fromTo(
      contentRef.current.querySelector(".hero-date"),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // Countdown
    tl.fromTo(
      contentRef.current.querySelector(".hero-countdown"),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.1"
    );

    // CTA
    tl.fromTo(
      contentRef.current.querySelector(".hero-cta"),
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
      "-=0.1"
    );
  }, [envelopeDone]);

  return (
    <>
      {/* Envelope overlay — shown after loading screen, before hero content */}
      {loaded && !envelopeDone && (
        <EnvelopeReveal onRevealed={handleEnvelopeRevealed} />
      )}

      <section
        ref={sectionRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ opacity: 0 }}
      >
        <div className="parallax-bg-wrap absolute inset-0" style={{ opacity: 0 }}>
          <ParallaxBackground />
        </div>

        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center gap-6 px-6 text-center sm:gap-8"
        >
          {/* Monogram */}
          <div className="hero-monogram" style={{ opacity: 0 }}>
            <MonogramReveal />
          </div>

          {/* Names */}
          <div className="hero-names" style={{ opacity: 0 }}>
            <h1
              className="text-4xl tracking-wide sm:text-5xl md:text-6xl"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Anu{" "}
              <span
                className="text-2xl sm:text-3xl md:text-4xl"
                style={{ color: "var(--gold-light)" }}
              >
                &amp;
              </span>{" "}
              Janak
            </h1>
          </div>

          {/* Date */}
          <div className="hero-date" style={{ opacity: 0 }}>
            <p
              className="text-sm uppercase tracking-[0.3em] sm:text-base"
              style={{
                color: "var(--gold-light)",
                fontFamily: "var(--font-body), sans-serif",
              }}
            >
              April 26, 2026
            </p>
          </div>

          {/* Countdown */}
          <div className="hero-countdown" style={{ opacity: 0 }}>
            <CountdownTimer />
          </div>

          {/* CTA */}
          <div className="hero-cta mt-2" style={{ opacity: 0 }}>
            <StartJourneyCTA onStart={onStartJourney} />
          </div>
        </div>
      </section>
    </>
  );
}
