"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  "/images/engagement/img1.jpeg",
  "/images/engagement/img3.jpeg",
  "/images/engagement/wedding_high",
];

export default function EngagementHighlights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const gallery = galleryRef.current;
    if (!section || !heading || !gallery) return;

    const ctx = gsap.context(() => {
      // Fade-in heading
      gsap.from(heading, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
        },
      });

      // Stagger-in gallery images
      const cards = gallery.querySelectorAll(".engagement-card");
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gallery,
          start: "top 80%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Auto-play video when it scrolls into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ background: "#0D0A08", position: "relative" }}>
      {/* Section heading */}
      <div
        ref={headingRef}
        style={{
          textAlign: "center",
          padding: "96px 24px 48px",
        }}
      >
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
          Our
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            color: "#F8F4EE",
            marginBottom: 16,
          }}
        >
          Engagement Highlights
        </h2>
        <div
          style={{
            width: 56,
            height: 1,
            background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
            margin: "0 auto 24px",
          }}
        />
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
          Where our forever began.
        </p>
      </div>

      {/* Video highlight — scrollable, the main attraction */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 56px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(201,169,110,0.1)",
            border: "1px solid rgba(201,169,110,0.15)",
          }}
        >
          <video
            ref={videoRef}
            src="/images/engagement/highlight-video.mp4"
            controls
            playsInline
            muted
            loop
            preload="metadata"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
              background: "#1a1a1a",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(248,244,238,0.35)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Tap for sound
        </p>
      </div>

      {/* Photo gallery */}
      <div
        ref={galleryRef}
        className="engagement-gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 2vw, 24px)",
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        {PHOTOS.map((src, i) => (
          <div
            key={i}
            className="engagement-card"
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              aspectRatio: "3/4",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(201,169,110,0.1)",
            }}
          >
            <Image
              src={src}
              alt={`Engagement photo ${i + 1}`}
              fill
              sizes="(max-width: 767px) 90vw, 30vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Mobile: stack gallery in single column */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .engagement-gallery-grid {
            grid-template-columns: 1fr !important;
            max-width: 360px !important;
          }
        }
      `}</style>
    </div>
  );
}
