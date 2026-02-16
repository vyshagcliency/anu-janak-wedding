"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeddingEvent } from "@/data/events";
import ColorPaletteBubbles from "./ColorPaletteBubbles";

type DetailType = "schedule" | "dresscode" | "venue";

interface Props {
  event: WeddingEvent;
  accentColor: string;
}

const PILLS: { type: DetailType; icon: string; label: string }[] = [
  { type: "schedule", icon: "\ud83d\udcc5", label: "Schedule" },
  { type: "dresscode", icon: "\ud83d\udc57", label: "Dress Code" },
  { type: "venue", icon: "\ud83d\udccd", label: "Venue" },
];

export default function EventDetails({ event, accentColor }: Props) {
  const [expanded, setExpanded] = useState<DetailType | null>(null);

  const toggle = (type: DetailType) => {
    setExpanded((prev) => (prev === type ? null : type));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Pill row */}
      <div className="flex flex-wrap justify-center gap-2">
        {PILLS.map(({ type, icon, label }) => (
          <motion.button
            key={type}
            onClick={() => toggle(type)}
            className="flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-colors"
            style={{
              background:
                expanded === type
                  ? `${accentColor}40`
                  : "rgba(255,255,255,0.1)",
              border: `1px solid ${expanded === type ? accentColor : "rgba(255,255,255,0.2)"}`,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            layout
          >
            <span>{icon}</span>
            <span>{label}</span>
            <motion.span
              animate={{ rotate: expanded === type ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1 text-xs"
            >
              \u25bc
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Expanded content */}
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            key={expanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-5 backdrop-blur-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: `1px solid ${accentColor}30`,
              }}
            >
              {expanded === "schedule" && (
                <div className="space-y-2 text-white/90">
                  <p className="text-sm">
                    <span className="font-semibold text-white">Date:</span>{" "}
                    {event.date}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-white">Time:</span>{" "}
                    {event.time}
                  </p>
                </div>
              )}

              {expanded === "dresscode" && (
                <div className="space-y-3">
                  <p className="text-sm text-white/90">{event.dressCode}</p>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/60">
                      Color Palette
                    </p>
                    <ColorPaletteBubbles colors={event.colors} />
                  </div>
                  {/* Placeholder for attire reference image */}
                  <div
                    className="flex h-32 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                    }}
                  >
                    <p className="text-xs text-white/40">
                      Attire reference photo
                    </p>
                  </div>
                </div>
              )}

              {expanded === "venue" && (
                <div className="space-y-3 text-white/90">
                  <p className="text-sm font-semibold text-white">
                    {event.venue}
                  </p>
                  <p className="text-sm">{event.venueAddress}</p>
                  <a
                    href={event.venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: accentColor,
                      boxShadow: `0 4px 16px ${accentColor}40`,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"
                        fill="currentColor"
                      />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
