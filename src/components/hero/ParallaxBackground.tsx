"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return;

    gsap.to(imgRef.current, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={imgRef} className="absolute inset-0 scale-110">
        <Image
          src="/images/hero/img3.jpeg"
          alt="Wedding venue"
          fill
          priority
          className="object-cover blur-[8px]"
          sizes="100vw"
        />
      </div>
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
