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
      style={{ borderColor: "rgba(201,169,110,0.18)" }}
    >
      <button
        onClick={onToggle}
        className="flex min-h-[52px] w-full items-center justify-between gap-4 py-5 text-left transition-opacity hover:opacity-70"
      >
        <span
          className="text-base font-medium sm:text-lg"
          style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#F8F4EE",
          }}
        >
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-lg"
          style={{ color: "#C9A96E" }}
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
                style={{ color: "rgba(248,244,238,0.55)" }}
              >
                {item.answer}
              </p>

              {item.attireImages && item.attireImages.length > 0 && (
                <div className="mt-4">
                  <p
                    className="mb-3 text-xs uppercase tracking-wider"
                    style={{ color: "rgba(201,169,110,0.7)" }}
                  >
                    Style Guide
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {item.attireImages.map((src) => (
                      <div
                        key={src}
                        className="relative aspect-[3/4] overflow-hidden rounded-lg"
                        style={{
                          border: "1px solid rgba(201,169,110,0.2)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        <Image
                          src={src}
                          alt="Attire style guide"
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
