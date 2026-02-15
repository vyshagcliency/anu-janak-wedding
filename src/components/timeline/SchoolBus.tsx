"use client";

import Lottie from "lottie-react";
import busData from "../../../public/lottie/school-bus.json";

interface Props {
  progress: number; // 0 to 1
}

export default function SchoolBus({ progress }: Props) {
  // Bus travels along the bottom road area
  // Position from 5% to 95% of container width based on scroll progress
  const xPercent = 5 + progress * 90;

  return (
    <div
      className="absolute z-20"
      style={{
        bottom: "8vh",
        left: `${xPercent}%`,
        transform: "translateX(-50%)",
        width: "100px",
        height: "60px",
      }}
    >
      <Lottie
        animationData={busData}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </div>
  );
}
