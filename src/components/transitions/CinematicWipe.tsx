"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  active: boolean;
  onComplete: () => void;
}

// Enter animation duration (seconds) — must match the clipPath transition below.
const ENTER_DURATION_MS = 900; // 0.8s + 100ms buffer

export default function CinematicWipe({ active, onComplete }: Props) {
  const calledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      calledRef.current = false;

      // Use a timer instead of onAnimationComplete to avoid a framer-motion
      // bug on iOS Safari where onAnimationComplete fires for the EXIT
      // animation before the ENTER animation, or fires in the wrong order.
      timerRef.current = setTimeout(() => {
        if (!calledRef.current) {
          calledRef.current = true;
          onComplete();
        }
      }, ENTER_DURATION_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ opacity: 0 }}
          transition={{
            clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            opacity: { delay: 0.6, duration: 0.4 },
          }}
          style={{
            background:
              "linear-gradient(180deg, var(--gold) 0%, var(--champagne) 50%, var(--ivory) 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
