"use client";

import { motion } from "framer-motion";

interface Props {
  colors: { hex: string; name: string }[];
}

export default function ColorPaletteBubbles({ colors }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 py-2">
      {colors.map((color, i) => (
        <motion.div
          key={color.hex}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: i * 0.06,
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          title={color.name}
          className="h-7 w-7 rounded-full md:h-8 md:w-8"
          style={{
            backgroundColor: color.hex,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}
