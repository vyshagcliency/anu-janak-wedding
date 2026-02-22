"use client";

import { motion } from "framer-motion";
import { useAudio } from "../providers/AudioProvider";

interface Props {
  onStart: () => void;
}

export default function StartJourneyCTA({ onStart }: Props) {
  const { play } = useAudio();

  const handleClick = () => {
    play();
    onStart();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative flex flex-col items-center gap-1 rounded-full border-2 px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors sm:px-10 sm:py-4 sm:text-base"
      style={{
        borderColor: "var(--gold)",
        color: "var(--gold)",
        fontFamily: "var(--font-body), sans-serif",
        cursor: "pointer",
        // iOS Safari: first tap = hover, second tap = click unless this is set
        touchAction: "manipulation",
      }}
      whileHover={{
        backgroundColor: "rgba(201, 169, 110, 0.15)",
        scale: 1.03,
      }}
      whileTap={{ scale: 0.97 }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(201, 169, 110, 0)",
          "0 0 0 8px rgba(201, 169, 110, 0.15)",
          "0 0 0 0 rgba(201, 169, 110, 0)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <span>How We Got Here!</span>
      <span
        className="text-[10px] tracking-wider"
        style={{ opacity: 0.8, fontWeight: "300" }}
      >
        Tap here
      </span>
    </motion.button>
  );
}
