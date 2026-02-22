"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQ_ITEMS } from "@/data/faq";
import FAQItem from "./FAQItem";

gsap.registerPlugin(ScrollTrigger);

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !listRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    tl.fromTo(
      listRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.2
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28"
      style={{ background: "#0D0A08" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60vw",
          height: "60vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-5">
        <h2
          ref={headingRef}
          className="mb-10 text-center text-3xl sm:text-4xl"
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#F8F4EE",
            opacity: 0,
          }}
        >
          Frequently Asked Questions
        </h2>

        <div ref={listRef} style={{ opacity: 0 }}>
          {FAQ_ITEMS.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

