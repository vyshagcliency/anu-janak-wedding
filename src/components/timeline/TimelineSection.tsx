"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxLayers from "./ParallaxLayers";
import BusRoad from "./BusRoad";
import RoadsideScenery from "./RoadsideScenery";
import SchoolVan from "./SchoolVan";
import BoardingFigure from "./BoardingFigure";
import TimelineStop from "./TimelineStop";
import CelebrationBurst from "./CelebrationBurst";

gsap.registerPlugin(ScrollTrigger);

/* ───── Stop data (positions adjusted per plan) ───── */
const STOPS = [
  {
    title: "Where It All Began",
    subtitle: "Chapter 1",
    description:
      "It started with a school van and two kids who had no idea what was coming in 2007.",
    imageSrc: "/images/timeline/classphoto1.jpeg",
    imageAlt: "Anu and Janak's class photo",
    position: 8,
    revealType: "circle" as const,
  },
  {
    title: "Childhood memories",
    subtitle: "Chapter 2",
    description:
      "Same school, same neighborhood, same school van, and a lot of growing up together.",
    imageSrc: "/images/timeline/classphoto2.jpeg",
    imageAlt: "School group photo with teachers",
    position: 25,
    revealType: "slide" as const,
  },
  {
    title: "Friendship to Love",
    subtitle: "Chapter 3",
    description:
      "Somewhere between walks and conversations, friendship quietly turned into something more. They just knew.",
    imageSrc: "/images/timeline/img2.jpeg",
    imageAlt: "Walking together on a nature path",
    position: 42,
    revealType: "fade" as const,
  },
  {
    title: "Growing Up, Separately",
    subtitle: "Chapter 4",
    description:
      "What followed was years of figuring out adulthood, navigating distance, and somehow always ending up back in each other's corner of the world.",
    imageSrc: "/images/timeline/img5.jpeg",
    imageAlt: "She walks ahead, he follows",
    position: 58,
    revealType: "split" as const,
  },
  {
    title: "Choosing Each Other",
    subtitle: "Chapter 5",
    description:
      "After all of that, saying yes felt less like a decision and more like something we'd already known for a long time.",
    imageSrc: "/images/timeline/img4.jpeg",
    imageAlt: "Intimate embrace through foliage",
    position: 75,
    revealType: "blur" as const,
  },
  {
    title: "Arriving at Forever",
    subtitle: "Chapter 6",
    description:
      "All of this brings us to one big day. Come celebrate with us on April 26, 2026.",
    imageSrc: "/images/timeline/chapter_6img",
    imageAlt: "Couple at the floral wedding entrance",
    position: 92,
    revealType: "grand" as const,
  },
];

/* ───── Vehicle state derivation from scroll progress ───── */
function deriveVehicleState(
  progress: number
): "bus" | "transforming" | "plane" {
  if (progress < 0.52) return "bus"; // Ch1-3
  if (progress < 0.58) return "transforming"; // Ch4 transition zone
  return "plane"; // Ch4-5-6 stays as plane
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
  const [isMobile, setIsMobile] = useState(false);

  const vehicleState = useMemo(
    () => deriveVehicleState(busProgress),
    [busProgress]
  );

  // Celebration fires once user reaches Ch6 (progress >= 0.88)
  const atFinale = busProgress >= 0.88;

  // Scroll to the events section
  const handleNext = () => {
    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Boarding figure progress (girl at stop 1, boy at stop 2)
  // Wider ranges so figures are visible across the full snap segment
  const girlProgress = getStopProgress(busProgress, 0.0, 0.18);
  const boyProgress = getStopProgress(busProgress, 0.18, 0.38);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: native horizontal scroll
  useEffect(() => {
    if (!isMobile || !sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const handleScroll = () => {
      const scrollLeft = section.scrollLeft;
      const maxScroll = section.scrollWidth - section.clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setBusProgress(progress);
    };

    section.addEventListener("scroll", handleScroll);
    return () => section.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Desktop: vertical scroll with GSAP ScrollTrigger
  useEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current) return;

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

    // Parallax layers at different speeds (desktop only)
    const clouds = sectionRef.current.querySelector(
      ".parallax-clouds"
    ) as HTMLElement;
    const hills = sectionRef.current.querySelector(
      ".parallax-hills"
    ) as HTMLElement;
    const trees = sectionRef.current.querySelector(
      ".parallax-trees"
    ) as HTMLElement;

    const parallaxTweens: gsap.core.Tween[] = [];

    if (clouds) {
      parallaxTweens.push(
        gsap.to(clouds, {
          x: () => -window.innerWidth * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
          },
        })
      );
    }

    if (hills) {
      parallaxTweens.push(
        gsap.to(hills, {
          x: () => -window.innerWidth * 1.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
          },
        })
      );
    }

    if (trees) {
      parallaxTweens.push(
        gsap.to(trees, {
          x: () => -window.innerWidth * 2.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
          },
        })
      );
    }

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      parallaxTweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="timeline-pin-spacer relative w-full"
      style={{
        height: "100vh",
        background: "var(--ivory)",
        overflow: isMobile ? "auto" : "hidden",
        overflowY: isMobile ? "hidden" : "visible",
        WebkitOverflowScrolling: "touch",
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
          <RoadsideScenery />
          <BusRoad />
        </div>

        {/* Boarding Figures */}
        {girlProgress > 0 && girlProgress < 1 && (
          <BoardingFigure
            type="girl"
            stopProgress={girlProgress}
            position={8}
          />
        )}
        {boyProgress > 0 && boyProgress < 1 && (
          <BoardingFigure
            type="boy"
            stopProgress={boyProgress}
            position={25}
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
            onNext={i === STOPS.length - 1 ? handleNext : undefined}
          />
        ))}
      </div>

      {/* Ch6 celebration — rendered outside the scrolling track so it stays fixed */}
      <CelebrationBurst active={atFinale} />
    </section>
  );
}
