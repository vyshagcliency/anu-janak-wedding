"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HashtagBanner from "@/components/ui/HashtagBanner";

gsap.registerPlugin(ScrollTrigger);

const EVENT_OPTIONS = [
  { id: "sundowner", label: "Sundowner Carnival" },
  { id: "sangeet", label: "Sangeet M\u00e9lange" },
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
    // Placeholder submit — log and show confirmation
    console.log("RSVP submitted:", formData);
    setSubmitted(true);
  };

  const inputClasses =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold)] sm:text-base";
  const inputStyle = {
    background: "white",
    borderColor: "var(--champagne)",
    color: "var(--charcoal)",
    fontFamily: "var(--font-inter), sans-serif",
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(to bottom, var(--ivory) 0%, var(--champagne) 100%)",
      }}
    >
      <div className="mx-auto max-w-xl px-5">
        {/* Hashtag banner */}
        <div className="rsvp-animate mb-10">
          <HashtagBanner />
        </div>

        {submitted ? (
          <div className="rsvp-animate text-center">
            <div
              className="mb-4 text-5xl"
              role="img"
              aria-label="celebration"
            >
              \ud83c\udf89
            </div>
            <h2
              className="mb-3 text-2xl sm:text-3xl"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--charcoal)",
              }}
            >
              Thank You!
            </h2>
            <p
              className="text-base"
              style={{ color: "var(--charcoal-light)" }}
            >
              We&apos;ve received your RSVP. We can&apos;t wait to celebrate
              with you!
            </p>
          </div>
        ) : (
          <>
            <h2
              className="rsvp-animate mb-2 text-center text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--charcoal)",
              }}
            >
              RSVP
            </h2>
            <p
              className="rsvp-animate mb-10 text-center text-sm sm:text-base"
              style={{ color: "var(--charcoal-light)" }}
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
                  style={{ color: "var(--charcoal)" }}
                >
                  Full Name <span className="text-red-400">*</span>
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
                  style={{ color: "var(--charcoal)" }}
                >
                  Email <span className="text-red-400">*</span>
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
                  style={{ color: "var(--charcoal)" }}
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
                  style={{ color: "var(--charcoal)" }}
                >
                  Number of Guests <span className="text-red-400">*</span>
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
                  style={{ color: "var(--charcoal)" }}
                >
                  Which events will you attend?{" "}
                  <span className="text-red-400">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EVENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                      style={{
                        borderColor: formData.events.includes(opt.id)
                          ? "var(--gold)"
                          : "var(--champagne)",
                        background: formData.events.includes(opt.id)
                          ? "var(--gold-light)"
                          : "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.events.includes(opt.id)}
                        onChange={() => handleEventToggle(opt.id)}
                        className="h-4 w-4 accent-[var(--gold)]"
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--charcoal)" }}
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
                  style={{ color: "var(--charcoal)" }}
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
                className="w-full rounded-full py-3.5 text-base font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--gold)",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.4)",
                  letterSpacing: "0.06em",
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
