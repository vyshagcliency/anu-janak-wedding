"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENTS } from "@/data/events";
import LuxuryEventGallery from "./LuxuryEventGallery";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_TEXT =
  "Join us as we celebrate love, joy, and the start of forever. This is your go-to for all the details as we count down to the big day.";

function ScrollRevealText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".reveal-word");

    gsap.set(words, { opacity: 0.12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.6,
      },
    });

    tl.to(words, {
      opacity: 1,
      duration: 0.15,
      stagger: 0.08,
      ease: "power2.out",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const words = REVEAL_TEXT.split(" ");

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "var(--font-handwriting), cursive",
        fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
        fontWeight: 400,
        color: "#F8F4EE",
        lineHeight: 1.5,
        maxWidth: 620,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="reveal-word"
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            opacity: 0.12,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

export default function LuxuryEventsSection() {
  useEffect(() => {
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="luxury-events-section">
      {/* Section intro — shown above all galleries, scrolls away naturally */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "96px 24px 64px",
          background: "#0D0A08",
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: 20,
            opacity: 0.8,
          }}
        >
          The Celebration
        </p>

        {/* Main heading — scroll-reveal word by word */}
        <ScrollRevealText />

        {/* Spacer to give scroll room for the reveal */}
        <div style={{ height: 24 }} />

        {/* Rule */}
        <div
          style={{
            width: 56,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #C9A96E, transparent)",
            margin: "0 auto 24px",
          }}
        />

        {/* Descriptor */}
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
            fontWeight: 300,
            color: "rgba(248,244,238,0.45)",
            letterSpacing: "0.08em",
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Scroll through each event.
          <br />
          Walk at your own pace.
        </p>
      </div>

      {/* Individual event galleries */}
      {EVENTS.map((event, i) => (
        <LuxuryEventGallery key={event.id} event={event} index={i} />
      ))}
    </div>
  );
}
