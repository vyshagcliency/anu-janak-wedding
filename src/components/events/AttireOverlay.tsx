"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AttireOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  eventTitle: string;
  dressCode: string;
}

export default function AttireOverlay({
  isOpen,
  onClose,
  images,
  eventTitle,
  dressCode,
}: AttireOverlayProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="attire-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(5,3,2,0.96)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close style guide"
            style={{
              position: "absolute",
              top: 28,
              right: 32,
              background: "none",
              border: "none",
              color: "rgba(248,244,238,0.6)",
              fontSize: "28px",
              fontWeight: 300,
              cursor: "pointer",
              lineHeight: 1,
              padding: "8px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "#F8F4EE")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,244,238,0.6)")
            }
          >
            ✕
          </button>

          {/* Inner content — stop propagation so clicks here don't close */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              maxWidth: 640,
              width: "100%",
            }}
          >
            {/* Label */}
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9A96E",
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 300,
              }}
            >
              {eventTitle} &middot; Style Guide
            </p>

            {/* Image(s) */}
            {images.map((src, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 520,
                  aspectRatio: "3/4",
                  borderRadius: "2px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                <Image
                  src={src}
                  alt={`${eventTitle} attire inspiration`}
                  fill
                  sizes="(max-width: 768px) 90vw, 520px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ))}

            {/* Dress code */}
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(248,244,238,0.4)",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                Dress Code
              </p>
              <p
                style={{
                  fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                  fontFamily: "var(--font-heading), serif",
                  color: "#F8F4EE",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                }}
              >
                {dressCode}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
