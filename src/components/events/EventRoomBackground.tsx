interface EventRoomBackgroundProps {
  timeOfDay: "sunset" | "night" | "morning" | "evening";
}

const ROOM_STYLES: Record<
  string,
  { background: string; vignette: string }
> = {
  sunset: {
    background:
      "radial-gradient(ellipse at 70% 40%, #8B4500 0%, #6B3200 35%, #3A1A00 70%, #1A0C00 100%)",
    vignette:
      "radial-gradient(ellipse at center, transparent 30%, rgba(20,8,0,0.6) 100%)",
  },
  night: {
    background:
      "radial-gradient(ellipse at 40% 50%, #1E0A38 0%, #110520 40%, #060210 70%, #020008 100%)",
    vignette:
      "radial-gradient(ellipse at center, transparent 25%, rgba(2,0,8,0.7) 100%)",
  },
  morning: {
    background:
      "radial-gradient(ellipse at 50% 20%, #8C6B4A 0%, #6B4A30 30%, #3D2A18 60%, #1E140C 100%)",
    vignette:
      "radial-gradient(ellipse at center, transparent 30%, rgba(15,8,4,0.55) 100%)",
  },
  evening: {
    background:
      "radial-gradient(ellipse at 30% 60%, #5A0A1E 0%, #3A0614 40%, #1E030A 70%, #0A0104 100%)",
    vignette:
      "radial-gradient(ellipse at center, transparent 25%, rgba(10,1,4,0.7) 100%)",
  },
};

// Subtle grain overlay using CSS (no additional images)
const GRAIN_OPACITY: Record<string, number> = {
  sunset: 0.04,
  night: 0.03,
  morning: 0.03,
  evening: 0.035,
};

export default function EventRoomBackground({
  timeOfDay,
}: EventRoomBackgroundProps) {
  const style = ROOM_STYLES[timeOfDay];
  const grain = GRAIN_OPACITY[timeOfDay];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Base gradient wall */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: style.background,
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: style.vignette,
        }}
      />

      {/* Subtle grain texture via SVG filter */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: grain,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Event-specific accent light */}
      {timeOfDay === "sunset" && (
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "15%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,140,0,0.18) 0%, transparent 70%)",
          }}
        />
      )}
      {timeOfDay === "night" && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(120,40,200,0.08) 0%, transparent 70%)",
          }}
        />
      )}
      {timeOfDay === "morning" && (
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60vw",
            height: "60vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(242,208,181,0.2) 0%, transparent 70%)",
          }}
        />
      )}
      {timeOfDay === "evening" && (
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "20%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(128,0,32,0.15) 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
