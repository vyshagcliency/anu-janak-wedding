"use client";

interface CinematicColorAccentsProps {
  colors: { hex: string; name: string }[];
}

export default function CinematicColorAccents({
  colors,
}: CinematicColorAccentsProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {colors.map((color) => (
        <div
          key={color.hex}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color.hex,
            boxShadow: `0 0 6px ${color.hex}40`,
          }}
          title={color.name}
        />
      ))}
    </div>
  );
}
