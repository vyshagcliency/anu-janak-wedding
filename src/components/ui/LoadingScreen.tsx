"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "var(--ivory)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* A */}
            <motion.text
              x="32"
              y="72"
              fontFamily="var(--font-playfair), serif"
              fontSize="36"
              fill="var(--gold)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              A
            </motion.text>
            {/* J */}
            <motion.text
              x="68"
              y="72"
              fontFamily="var(--font-playfair), serif"
              fontSize="36"
              fill="var(--gold)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              J
            </motion.text>
            {/* Ampersand */}
            <motion.text
              x="50"
              y="64"
              fontFamily="var(--font-playfair), serif"
              fontSize="14"
              fill="var(--gold-light)"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              &amp;
            </motion.text>
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
