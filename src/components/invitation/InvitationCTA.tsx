"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InvitationCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>(".inv-animate");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      items,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const handleRSVP = () => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#0D0A08",
        overflow: "hidden",
        padding: "100px 24px 110px",
        textAlign: "center",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "70vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top ornament */}
      <div className="inv-animate" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 1,
              height: 48,
              background:
                "linear-gradient(to bottom, transparent, #C9A96E, transparent)",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#C9A96E",
              opacity: 0.85,
            }}
          >
            You are Invited
          </p>
        </div>
      </div>

      {/* Monogram */}
      <div className="inv-animate" style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
            fontWeight: 400,
            color: "#F8F4EE",
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          A{" "}
          <span
            style={{
              fontSize: "0.55em",
              color: "#C9A96E",
              fontStyle: "italic",
            }}
          >
            &amp;
          </span>{" "}
          J
        </p>
      </div>

      {/* Heading */}
      <h2
        className="inv-animate"
        style={{
          fontFamily: "var(--font-heading), serif",
          fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
          fontWeight: 400,
          color: "#F8F4EE",
          letterSpacing: "0.04em",
          lineHeight: 1.2,
          marginBottom: 20,
          maxWidth: 560,
          margin: "0 auto 20px",
        }}
      >
        We'd love to have you
        <br />
        with us as we celebrate.
      </h2>

      {/* Divider */}
      <div
        className="inv-animate"
        style={{
          width: 56,
          height: 1,
          background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          margin: "0 auto 28px",
        }}
      />

      {/* Body copy */}
      <p
        className="inv-animate"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "clamp(0.8rem, 1.8vw, 0.95rem)",
          fontWeight: 300,
          color: "rgba(248,244,238,0.55)",
          letterSpacing: "0.06em",
          lineHeight: 1.9,
          maxWidth: 440,
          margin: "0 auto 16px",
        }}
      >
        Four days of joy, music, and togetherness await —
        <br />
        from the warmth of a Sundowner to the grace of the
        <br />
        Wedding Ceremony and beyond.
      </p>

      {/* Date line */}
      <p
        className="inv-animate"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#C9A96E",
          marginBottom: 48,
          opacity: 0.9,
        }}
      >
        April 24 – 27, 2026 &nbsp;·&nbsp; Kerala, India
      </p>

      {/* CTA */}
      <div className="inv-animate">
        <button
          onClick={handleRSVP}
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#0D0A08",
            background: "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)",
            border: "none",
            borderRadius: 999,
            padding: "16px 48px",
            cursor: "pointer",
            touchAction: "manipulation",
            fontWeight: 500,
            boxShadow:
              "0 0 0 1px rgba(201,169,110,0.3), 0 8px 32px rgba(201,169,110,0.2)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 0 1px rgba(201,169,110,0.5), 0 12px 40px rgba(201,169,110,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 0 1px rgba(201,169,110,0.3), 0 8px 32px rgba(201,169,110,0.2)";
          }}
        >
          Confirm Your Attendance
        </button>
      </div>

      {/* Bottom ornament */}
      <div
        className="inv-animate"
        style={{ marginTop: 48, display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: 0.3,
          }}
        >
          <div style={{ width: 40, height: 1, background: "#C9A96E" }} />
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#C9A96E",
            }}
          />
          <div style={{ width: 40, height: 1, background: "#C9A96E" }} />
        </div>
      </div>
    </section>
  );
}
