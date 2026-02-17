"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import AudioProvider from "@/components/providers/AudioProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import AudioToggle from "@/components/ui/AudioToggle";
import HeroSection from "@/components/hero/HeroSection";
import CinematicWipe from "@/components/transitions/CinematicWipe";

const TimelineSection = dynamic(
  () => import("@/components/timeline/TimelineSection"),
  { ssr: false }
);

const LuxuryEventsSection = dynamic(
  () => import("@/components/events/LuxuryEventsSection"),
  { ssr: false }
);

const FAQSection = dynamic(
  () => import("@/components/faq/FAQSection"),
  { ssr: false }
);

const RSVPSection = dynamic(
  () => import("@/components/rsvp/RSVPSection"),
  { ssr: false }
);

export default function Home() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [showWipe, setShowWipe] = useState(false);

  const handleStartJourney = useCallback(() => {
    setShowWipe(true);
  }, []);

  const handleWipeComplete = useCallback(() => {
    setShowWipe(false);
    setJourneyStarted(true);

    // Double-rAF ensures React has flushed the re-render and the TimelineSection
    // wrapper div is in layout before we scroll. The 120ms timeout gives the
    // dynamic import a moment to mount so the scroll lands at the right place.
    // On mobile, scrollIntoView with 'smooth' can be unreliable (iOS Safari),
    // so we also fall back to window.scrollTo with the element's offsetTop.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = timelineRef.current;
          if (!el) return;
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, behavior: "smooth" });
        }, 120);
      });
    });
  }, []);

  return (
    <AudioProvider>
      <SmoothScrollProvider>
        <LoadingScreen />
        <ScrollProgressBar />
        <AudioToggle />

        <CinematicWipe active={showWipe} onComplete={handleWipeComplete} />

        <main>
          <HeroSection onStartJourney={handleStartJourney} />

          <div ref={timelineRef}>
            {journeyStarted && <TimelineSection />}
          </div>

          {journeyStarted && (
            <>
              <div id="events-section">
                <LuxuryEventsSection />
              </div>
              <FAQSection />
              <RSVPSection />
            </>
          )}
        </main>
      </SmoothScrollProvider>
    </AudioProvider>
  );
}
