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
      "2012 is when something shifted. We stopped being just friends, though neither of us could tell you exactly when or how.",
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
    imageSrc: "/images/timeline/chapter_6img.jpeg",
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

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const mobile = window.innerWidth <= 768;

    // ── MOBILE: touch-driven horizontal movement ──
    if (mobile) {
      let progress = 0;
      let startX = 0;
      let startY = 0;
      let startProgress = 0;
      // null = undecided, "horizontal" = we handle it, "vertical" = let browser handle
      let swipeDirection: "horizontal" | "vertical" | null = null;

      // Snap points for each chapter (0, 0.2, 0.4, 0.6, 0.8, 1.0)
      const snapPoints = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

      const snapToNearest = (p: number) => {
        let closest = snapPoints[0];
        let minDist = Math.abs(p - closest);
        for (const sp of snapPoints) {
          const dist = Math.abs(p - sp);
          if (dist < minDist) {
            minDist = dist;
            closest = sp;
          }
        }
        return closest;
      };

      const applyProgress = (p: number) => {
        progress = Math.max(0, Math.min(1, p));
        const xPct = -(progress * 83.33);
        gsap.set(track, { xPercent: xPct });
        setBusProgress(progress);
      };

      const animateToSnap = (target: number) => {
        const xPct = -(target * 83.33);
        gsap.to(track, {
          xPercent: xPct,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: () => {
            const current = gsap.getProperty(track, "xPercent") as number;
            progress = -(current / 83.33);
            setBusProgress(progress);
          },
          onComplete: () => {
            progress = target;
            setBusProgress(target);
          },
        });
      };

      const onTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startProgress = progress;
        swipeDirection = null;
        gsap.killTweensOf(track);
      };

      const onTouchMove = (e: TouchEvent) => {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        // Decide direction on first significant movement
        if (swipeDirection === null) {
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          if (absDx < 8 && absDy < 8) return; // too small to decide
          swipeDirection = absDx > absDy ? "horizontal" : "vertical";
        }

        // Vertical swipe — let the browser handle page scroll
        if (swipeDirection === "vertical") return;

        // Horizontal swipe — we drive the timeline
        e.preventDefault();
        const delta = -dx / (window.innerWidth * 0.8);
        applyProgress(startProgress + delta);
      };

      const onTouchEnd = () => {
        if (swipeDirection !== "horizontal") return;
        const target = snapToNearest(progress);
        animateToSnap(target);
      };

      section.addEventListener("touchstart", onTouchStart, { passive: true });
      section.addEventListener("touchmove", onTouchMove, { passive: false });
      section.addEventListener("touchend", onTouchEnd, { passive: true });

      // Set initial position
      applyProgress(0);

      return () => {
        section.removeEventListener("touchstart", onTouchStart);
        section.removeEventListener("touchmove", onTouchMove);
        section.removeEventListener("touchend", onTouchEnd);
        gsap.killTweensOf(track);
      };
    }

    // ── DESKTOP: vertical scroll with GSAP ScrollTrigger ──
    const scrollTween = gsap.to(track, {
      xPercent: -83.33,
      ease: "none",
      scrollTrigger: {
        id: "timeline-horizontal",
        trigger: section,
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
    const clouds = section.querySelector(".parallax-clouds") as HTMLElement;
    const hills = section.querySelector(".parallax-hills") as HTMLElement;
    const trees = section.querySelector(".parallax-trees") as HTMLElement;

    const parallaxTweens: gsap.core.Tween[] = [];

    if (clouds) {
      parallaxTweens.push(
        gsap.to(clouds, {
          x: () => -window.innerWidth * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
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
            trigger: section,
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
            trigger: section,
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="timeline-pin-spacer relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background: "var(--ivory)",
        touchAction: "pan-y",
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
