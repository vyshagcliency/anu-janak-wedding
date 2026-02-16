"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { FAQItem as FAQItemType } from "@/data/faq";

interface Props {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({ item, isOpen, onToggle }: Props) {
  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--champagne)" }}
    >
      <button
        onClick={onToggle}
        className="flex min-h-[52px] w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:opacity-80"
      >
        <span
          className="text-base font-medium sm:text-lg"
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "var(--charcoal)",
          }}
        >
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-lg"
          style={{ color: "var(--gold)" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <p
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--charcoal-light)" }}
              >
                {item.answer}
              </p>

              {/* Attire reference images (placeholder) */}
              {item.attireImages && item.attireImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {item.attireImages.map((src) => (
                    <div
                      key={src}
                      className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        background: "var(--champagne)",
                        border: "1px dashed var(--gold-light)",
                      }}
                    >
                      <p
                        className="text-center text-xs"
                        style={{ color: "var(--charcoal-light)" }}
                      >
                        Attire reference
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
