"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENTS } from "@/data/events";
import EventSection from "./EventSection";

export default function EventsContainer() {
  useEffect(() => {
    // Refresh ScrollTrigger after dynamic import mount
    // Use rAF to wait for layout to settle
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      {EVENTS.map((event, i) => (
        <EventSection key={event.id} event={event} index={i} />
      ))}
    </div>
  );
}
