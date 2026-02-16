"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TimeOfDay = "sunset" | "night" | "morning" | "evening";

const OVERLAY_GRADIENTS: Record<TimeOfDay, string> = {
  sunset:
    "linear-gradient(to bottom, rgba(180,100,40,0.3) 0%, rgba(200,130,50,0.2) 50%, rgba(160,80,30,0.35) 100%)",
  night:
    "linear-gradient(to bottom, rgba(10,15,40,0.5) 0%, rgba(20,25,60,0.4) 50%, rgba(10,15,40,0.55) 100%)",
  morning:
    "linear-gradient(to bottom, rgba(255,255,240,0.25) 0%, rgba(240,248,255,0.2) 50%, rgba(255,255,240,0.3) 100%)",
  evening:
    "linear-gradient(to bottom, rgba(20,20,30,0.45) 0%, rgba(40,35,25,0.35) 50%, rgba(20,20,30,0.5) 100%)",
};

const AMBIENT_GLOW: Record<TimeOfDay, string> = {
  sunset:
    "radial-gradient(ellipse at 50% 30%, rgba(255,180,80,0.15) 0%, transparent 70%)",
  night:
    "radial-gradient(ellipse at 50% 40%, rgba(80,100,200,0.12) 0%, transparent 70%)",
  morning:
    "radial-gradient(ellipse at 50% 20%, rgba(255,240,200,0.18) 0%, transparent 70%)",
  evening:
    "radial-gradient(ellipse at 50% 50%, rgba(200,170,100,0.1) 0%, transparent 70%)",
};

interface Props {
  bgImage: string;
  timeOfDay: TimeOfDay;
}

export default function EventBackground({ bgImage, timeOfDay }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return;

    const anim = gsap.to(imgRef.current, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Blurred photo */}
      <div ref={imgRef} className="absolute inset-0 scale-110">
        <Image
          src={bgImage}
          alt=""
          fill
          loading="lazy"
          className="object-cover blur-[10px]"
          sizes="100vw"
        />
      </div>

      {/* Time-of-day gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: OVERLAY_GRADIENTS[timeOfDay] }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{ background: AMBIENT_GLOW[timeOfDay] }}
      />
    </div>
  );
}
