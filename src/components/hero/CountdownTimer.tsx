"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WEDDING_DATE = new Date("2026-04-26T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flip-card relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg sm:h-16 sm:w-16"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-2xl font-semibold sm:text-3xl"
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-playfair), serif",
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-[10px] uppercase tracking-widest sm:text-xs"
        style={{ color: "var(--gold-light)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <div className="h-20" />;

  return (
    <div className="flex gap-3 sm:gap-4">
      <FlipUnit value={time.days} label="Days" />
      <FlipUnit value={time.hours} label="Hours" />
      <FlipUnit value={time.minutes} label="Min" />
      <FlipUnit value={time.seconds} label="Sec" />
    </div>
  );
}
