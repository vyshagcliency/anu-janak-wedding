"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HashtagBanner from "@/components/ui/HashtagBanner";

gsap.registerPlugin(ScrollTrigger);

const EVENT_OPTIONS = [
  { id: "sundowner", label: "Sundowner Carnival" },
  { id: "sangeet", label: "Sangeet Mélange" },
  { id: "wedding", label: "Wedding Ceremony" },
  { id: "reception", label: "Reception" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  events: string[];
  dietary: string;
}

export default function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    guests: "1",
    events: [],
    dietary: "",
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    const children = sectionRef.current.querySelectorAll(".rsvp-animate");
    tl.fromTo(
      children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("RSVP submitted:", formData);
    setSubmitted(true);
  };

  // Dark-theme input shared styles
  const inputClasses =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A96E] sm:text-base";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    borderColor: "rgba(201,169,110,0.25)",
    color: "#F8F4EE",
    fontFamily: "var(--font-inter), sans-serif",
  };

  const labelStyle = {
    color: "rgba(248,244,238,0.75)",
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="relative py-20 sm:py-28"
      style={{ background: "#0D0A08" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70vw",
          height: "70vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative mx-auto max-w-xl px-5">
        {/* Hashtag banner */}
        <div className="rsvp-animate mb-10">
          <HashtagBanner />
        </div>

        {submitted ? (
          <div className="rsvp-animate text-center">
            <div className="mb-4 text-5xl" role="img" aria-label="celebration">
              🎉
            </div>
            <h2
              className="mb-3 text-2xl sm:text-3xl"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "#F8F4EE",
              }}
            >
              Thank You!
            </h2>
            <p className="text-base" style={{ color: "rgba(248,244,238,0.55)" }}>
              We&apos;ve received your RSVP. We can&apos;t wait to celebrate
              with you!
            </p>
          </div>
        ) : (
          <>
            {/* Section label */}
            <p
              className="rsvp-animate"
              style={{
                textAlign: "center",
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "#C9A96E",
                marginBottom: 12,
                opacity: 0.85,
              }}
            >
              Reserve Your Place
            </p>

            <h2
              className="rsvp-animate mb-2 text-center text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "#F8F4EE",
              }}
            >
              RSVP
            </h2>

            {/* Divider */}
            <div
              className="rsvp-animate"
              style={{
                width: 48,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #C9A96E, transparent)",
                margin: "0 auto 16px",
              }}
            />

            <p
              className="rsvp-animate mb-10 text-center text-sm sm:text-base"
              style={{ color: "rgba(248,244,238,0.45)" }}
            >
              We&apos;d love to have you there. Let us know you&apos;re coming!
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rsvp-animate space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="mb-1 block text-sm font-medium"
                  style={labelStyle}
                >
                  Full Name <span style={{ color: "#C9A96E" }}>*</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="rsvp-email"
                  className="mb-1 block text-sm font-medium"
                  style={labelStyle}
                >
                  Email <span style={{ color: "#C9A96E" }}>*</span>
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="rsvp-phone"
                  className="mb-1 block text-sm font-medium"
                  style={labelStyle}
                >
                  Phone
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  placeholder="+91 12345 67890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  htmlFor="rsvp-guests"
                  className="mb-1 block text-sm font-medium"
                  style={labelStyle}
                >
                  Number of Guests <span style={{ color: "#C9A96E" }}>*</span>
                </label>
                <input
                  id="rsvp-guests"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, guests: e.target.value }))
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>

              {/* Events attending */}
              <fieldset>
                <legend
                  className="mb-2 text-sm font-medium"
                  style={labelStyle}
                >
                  Which events will you attend?{" "}
                  <span style={{ color: "#C9A96E" }}>*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EVENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                      style={{
                        borderColor: formData.events.includes(opt.id)
                          ? "#C9A96E"
                          : "rgba(201,169,110,0.2)",
                        background: formData.events.includes(opt.id)
                          ? "rgba(201,169,110,0.12)"
                          : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.events.includes(opt.id)}
                        onChange={() => handleEventToggle(opt.id)}
                        className="h-4 w-4 accent-[#C9A96E]"
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: formData.events.includes(opt.id)
                            ? "#F8F4EE"
                            : "rgba(248,244,238,0.65)",
                        }}
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Dietary notes */}
              <div>
                <label
                  htmlFor="rsvp-dietary"
                  className="mb-1 block text-sm font-medium"
                  style={labelStyle}
                >
                  Dietary Requirements / Notes
                </label>
                <textarea
                  id="rsvp-dietary"
                  rows={3}
                  placeholder="Any allergies or dietary preferences..."
                  value={formData.dietary}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, dietary: e.target.value }))
                  }
                  className={inputClasses}
                  style={{ ...inputStyle, resize: "none" as const }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)",
                  color: "#0D0A08",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  boxShadow:
                    "0 0 0 1px rgba(201,169,110,0.3), 0 8px 32px rgba(201,169,110,0.2)",
                }}
              >
                Send RSVP
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
