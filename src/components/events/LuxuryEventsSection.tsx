"use client";

import { useRef } from "react";
import { EVENTS } from "@/data/events";
import LuxuryEventGallery from "./LuxuryEventGallery";

export default function LuxuryEventsSection() {
  const introRef = useRef<HTMLDivElement>(null);

  return (
    <div className="luxury-events-section">
      {/* Section intro — shown above all galleries, scrolls away naturally */}
      <div
        ref={introRef}
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

        {/* Main heading */}
        <h2
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 400,
            color: "#F8F4EE",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Four Evenings.
          <br />
          One Story.
        </h2>

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
