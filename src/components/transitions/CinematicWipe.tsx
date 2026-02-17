"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  active: boolean;
  onComplete: () => void;
}

export default function CinematicWipe({ active, onComplete }: Props) {
  // Guard: onAnimationComplete fires for BOTH the enter AND exit animations.
  // Without this, onComplete (which calls scrollIntoView) fires twice —
  // the second call ~1.4s later interrupts the scroll and kicks the user back.
  const calledRef = useRef(false);

  useEffect(() => {
    if (active) calledRef.current = false; // reset each time wipe activates
  }, [active]);

  const handleAnimationComplete = () => {
    if (!calledRef.current) {
      calledRef.current = true;
      onComplete();
    }
  };

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
          onAnimationComplete={handleAnimationComplete}
          style={{
            background:
              "linear-gradient(180deg, var(--gold) 0%, var(--champagne) 50%, var(--ivory) 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
