"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import AudioProvider from "@/components/providers/AudioProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import AudioToggle from "@/components/ui/AudioToggle";
import HeroSection from "@/components/hero/HeroSection";
import CinematicWipe from "@/components/transitions/CinematicWipe";
import InvitationCTA from "@/components/invitation/InvitationCTA";

const TimelineSection = dynamic(
  () => import("@/components/timeline/TimelineSection"),
  { ssr: false }
);

const LuxuryEventsSection = dynamic(
  () => import("@/components/events/LuxuryEventsSection"),
  { ssr: false }
);

const EngagementHighlights = dynamic(
  () => import("@/components/engagement/EngagementHighlights"),
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
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [showWipe, setShowWipe] = useState(false);

  const handleStartJourney = useCallback(() => {
    setShowWipe(true);
  }, []);

  const handleWipeComplete = useCallback(() => {
    // Ensure we're at the top, then swap hero → timeline while wipe still
    // covers the screen. No scroll logic needed: once the hero is removed from
    // the DOM the timeline renders at position 0, so when the wipe fades out
    // the user lands directly on the timeline regardless of device/browser.
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setJourneyStarted(true);
    setShowWipe(false);
  }, []);

  return (
    <AudioProvider>
      <SmoothScrollProvider>
        <LoadingScreen />
        <ScrollProgressBar />
        <AudioToggle />

        <CinematicWipe active={showWipe} onComplete={handleWipeComplete} />

        <main>
          {!journeyStarted ? (
            <HeroSection onStartJourney={handleStartJourney} />
          ) : (
            <>
              <TimelineSection />
              <div id="events-section">
                <LuxuryEventsSection />
              </div>
              <InvitationCTA />
              <EngagementHighlights />
              <FAQSection />
              <RSVPSection />
            </>
          )}
        </main>
      </SmoothScrollProvider>
    </AudioProvider>
  );
}
