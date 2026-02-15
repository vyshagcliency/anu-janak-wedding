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

    // Scroll to timeline after a brief moment
    requestAnimationFrame(() => {
      timelineRef.current?.scrollIntoView({ behavior: "smooth" });
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
        </main>
      </SmoothScrollProvider>
    </AudioProvider>
  );
}
