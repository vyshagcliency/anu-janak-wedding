"use client";

import { useMemo } from "react";

type TimeOfDay = "sunset" | "night" | "morning" | "evening";

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
  className: string;
  style?: React.CSSProperties;
}

function generateParticles(timeOfDay: TimeOfDay): Particle[] {
  const particles: Particle[] = [];
  const seed = timeOfDay === "sunset" ? 1 : timeOfDay === "night" ? 2 : timeOfDay === "morning" ? 3 : 4;

  const count =
    timeOfDay === "night" ? 20 : timeOfDay === "sunset" ? 15 : timeOfDay === "morning" ? 12 : 15;

  for (let i = 0; i < count; i++) {
    const pseudoRandom = ((seed * 31 + i * 17) % 100) / 100;
    const pseudoRandom2 = ((seed * 47 + i * 23) % 100) / 100;

    const base: Omit<Particle, "className" | "style"> = {
      id: i,
      left: `${(pseudoRandom * 100).toFixed(1)}%`,
      top: `${(pseudoRandom2 * 100).toFixed(1)}%`,
      size: 0,
      delay: `${(pseudoRandom * 5).toFixed(1)}s`,
      duration: `${3 + pseudoRandom2 * 4}s`,
      opacity: 0.3 + pseudoRandom * 0.4,
    };

    switch (timeOfDay) {
      case "sunset":
        particles.push({
          ...base,
          size: 3 + pseudoRandom * 4,
          className: "event-particle-dust",
          style: {
            background: `rgba(255, ${180 + pseudoRandom * 60}, ${80 + pseudoRandom2 * 60}, ${base.opacity})`,
            borderRadius: "50%",
          },
        });
        break;
      case "night":
        particles.push({
          ...base,
          size: 2 + pseudoRandom * 3,
          className: "event-particle-sparkle",
          style: {
            background: `rgba(${200 + pseudoRandom * 55}, ${200 + pseudoRandom2 * 55}, 255, ${base.opacity})`,
            borderRadius: "50%",
          },
        });
        break;
      case "morning":
        particles.push({
          ...base,
          size: 6 + pseudoRandom * 6,
          className: "event-particle-petal",
          style: {
            background: `rgba(255, ${200 + pseudoRandom * 40}, ${200 + pseudoRandom2 * 30}, ${base.opacity * 0.7})`,
            borderRadius: "60% 40% 50% 50%",
          },
        });
        break;
      case "evening":
        particles.push({
          ...base,
          size: 4 + pseudoRandom * 8,
          className: "event-particle-bokeh",
          style: {
            background: `radial-gradient(circle, rgba(201,169,110,${base.opacity * 0.6}) 0%, transparent 70%)`,
            borderRadius: "50%",
          },
        });
        break;
    }
  }

  return particles;
}

interface Props {
  timeOfDay: TimeOfDay;
}

export default function EventParticles({ timeOfDay }: Props) {
  const particles = useMemo(() => generateParticles(timeOfDay), [timeOfDay]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.className}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            willChange: "transform, opacity",
            ...p.style,
          }}
        />
      ))}
    </div>
  );
}
