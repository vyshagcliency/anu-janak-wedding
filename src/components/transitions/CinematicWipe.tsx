"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  active: boolean;
  onComplete: () => void;
}

export default function CinematicWipe({ active, onComplete }: Props) {
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
          onAnimationComplete={onComplete}
          style={{
            background:
              "linear-gradient(180deg, var(--gold) 0%, var(--champagne) 50%, var(--ivory) 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
