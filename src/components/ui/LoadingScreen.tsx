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
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hashtag-shimmer"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              color: "var(--gold)",
              letterSpacing: "0.02em",
            }}
          >
            #JaAnKeDilSe
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
