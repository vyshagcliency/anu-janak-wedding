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
    // 1. Render the timeline section immediately
    setJourneyStarted(true);

    // 2. Wait for React to flush the re-render so the wrapper div is in layout,
    //    then jump to the timeline position BEFORE fading the wipe out.
    //    Using "instant" (synchronous) scroll so the position is set before
    //    the wipe becomes transparent — this prevents the hero section from
    //    flashing into view on mobile while the wipe is still fading.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = timelineRef.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          // "instant" is reliable on all mobile browsers; the wipe is still
          // covering the screen so the jump is invisible to the user.
          window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
        }
        // 3. NOW fade the wipe out — page is already at the timeline position.
        setShowWipe(false);
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
