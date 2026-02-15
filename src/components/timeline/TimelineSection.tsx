"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxLayers from "./ParallaxLayers";
import BusRoad from "./BusRoad";
import SchoolVan from "./SchoolVan";
import SchoolBuilding from "./SchoolBuilding";
import BoardingFigure from "./BoardingFigure";
import TimelineStop from "./TimelineStop";

gsap.registerPlugin(ScrollTrigger);

/* ───── Stop data (positions adjusted per plan) ───── */
const STOPS = [
  {
    title: "Where It All Began",
    subtitle: "Chapter 1",
    description:
      "Two kids in the same class, same school van — not knowing the universe had already written their story.",
    imageSrc: "/images/timeline/classphoto1.jpeg",
    imageAlt: "Anu and Janak's class photo",
    position: 14,
    revealType: "circle" as const,
  },
  {
    title: "School Van Memories",
    subtitle: "Chapter 2",
    description:
      "Morning rides, shared laughter, and the kind of friendship that feels effortless. The school van was their first world together.",
    imageSrc: "/images/timeline/classphoto2.jpeg",
    imageAlt: "School group photo with teachers",
    position: 30,
    revealType: "slide" as const,
  },
  {
    title: "Friendship to Love",
    subtitle: "Chapter 3",
    description:
      "Somewhere between walks and conversations, friendship quietly turned into something more. They just knew.",
    imageSrc: "/images/timeline/img2.jpeg",
    imageAlt: "Walking together on a nature path",
    position: 44,
    revealType: "fade" as const,
  },
  {
    title: "Growing Up, Separately",
    subtitle: "Chapter 4",
    description:
      "Life took them on different paths — different cities, different dreams. But some threads can't be cut by distance.",
    imageSrc: "/images/timeline/img5.jpeg",
    imageAlt: "She walks ahead, he follows",
    position: 60,
    revealType: "split" as const,
  },
  {
    title: "Choosing Each Other",
    subtitle: "Chapter 5",
    description:
      "After all the years, all the roads — they chose each other. Not by chance, but by heart.",
    imageSrc: "/images/timeline/img6.jpeg",
    imageAlt: "Intimate embrace through foliage",
    position: 76,
    revealType: "blur" as const,
  },
  {
    title: "Arriving at Forever",
    subtitle: "Chapter 6",
    description:
      "And so the journey leads here — to April 26, 2026. To the beginning of the rest of their lives, together.",
    imageSrc: "/images/timeline/img4.jpeg",
    imageAlt: "Couple at the floral wedding entrance",
    position: 92,
    revealType: "grand" as const,
  },
];

/* ───── Vehicle state derivation from scroll progress ───── */
function deriveVehicleState(
  progress: number
): "bus" | "transforming" | "plane" {
  if (progress < 0.55) return "bus"; // Ch1-3
  if (progress < 0.62) return "transforming"; // Ch4 transition zone
  if (progress < 0.88) return "plane"; // Ch4-5 flying
  return "bus"; // Ch6 landing
}

/* ───── Per-stop progress for boarding figures ───── */
function getStopProgress(
  busProgress: number,
  stopStart: number,
  stopEnd: number
): number {
  if (busProgress < stopStart) return 0;
  if (busProgress > stopEnd) return 1;
  return (busProgress - stopStart) / (stopEnd - stopStart);
}

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [busProgress, setBusProgress] = useState(0);

  const vehicleState = useMemo(
    () => deriveVehicleState(busProgress),
    [busProgress]
  );

  // Boarding figure progress (girl at stop 1, boy at stop 2)
  const girlProgress = getStopProgress(busProgress, 0.05, 0.2);
  const boyProgress = getStopProgress(busProgress, 0.2, 0.38);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;

    // Horizontal scroll via GSAP ScrollTrigger pin
    const scrollTween = gsap.to(track, {
      xPercent: -83.33,
      ease: "none",
      scrollTrigger: {
        id: "timeline-horizontal",
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / 5,
          duration: { min: 0.2, max: 0.6 },
          ease: "power1.inOut",
        },
        end: () => `+=${window.innerHeight * 5}`,
        onUpdate: (self) => {
          setBusProgress(self.progress);
        },
      },
    });

    // Parallax layers at different speeds
    const clouds = sectionRef.current.querySelector(
      ".parallax-clouds"
    ) as HTMLElement;
    const hills = sectionRef.current.querySelector(
      ".parallax-hills"
    ) as HTMLElement;
    const trees = sectionRef.current.querySelector(
      ".parallax-trees"
    ) as HTMLElement;

    if (clouds) {
      gsap.to(clouds, {
        x: () => -window.innerWidth * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 5}`,
        },
      });
    }

    if (hills) {
      gsap.to(hills, {
        x: () => -window.innerWidth * 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 5}`,
        },
      });
    }

    if (trees) {
      gsap.to(trees, {
        x: () => -window.innerWidth * 2.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 5}`,
        },
      });
    }

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="timeline-pin-spacer relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background: "var(--ivory)",
      }}
    >
      {/* The wide horizontal track */}
      <div
        ref={trackRef}
        className="relative flex h-full"
        style={{ width: "600vw" }}
      >
        {/* Background layers */}
        <div className="absolute inset-0">
          <ParallaxLayers />
          <BusRoad />
        </div>

        {/* School Building at journey start */}
        <SchoolBuilding />

        {/* Boarding Figures */}
        {girlProgress > 0 && girlProgress < 1 && (
          <BoardingFigure
            type="girl"
            stopProgress={girlProgress}
            position={14}
          />
        )}
        {boyProgress > 0 && boyProgress < 1 && (
          <BoardingFigure
            type="boy"
            stopProgress={boyProgress}
            position={30}
          />
        )}

        {/* School Van (bus / plane) */}
        <SchoolVan progress={busProgress} vehicleState={vehicleState} />

        {/* Timeline stops */}
        {STOPS.map((stop, i) => (
          <TimelineStop
            key={i}
            index={i + 1}
            title={stop.title}
            subtitle={stop.subtitle}
            description={stop.description}
            imageSrc={stop.imageSrc}
            imageAlt={stop.imageAlt}
            position={stop.position}
            revealType={stop.revealType}
          />
        ))}
      </div>
    </section>
  );
}
