"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Howl } from "howler";

interface AudioContextValue {
  isPlaying: boolean;
  toggle: () => void;
  play: () => void;
  fadeOut: () => void;
  /** Pause bg music temporarily (e.g. while engagement video plays) */
  pauseBg: () => void;
  /** Resume bg music after temporary pause */
  resumeBg: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: false,
  toggle: () => {},
  play: () => {},
  fadeOut: () => {},
  pauseBg: () => {},
  resumeBg: () => {},
});

export const useAudio = () => useContext(AudioCtx);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Track whether bg was playing before a temporary pause
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    // Always start fresh — ignore previous muted state
    localStorage.removeItem("aj-muted");

    const howl = new Howl({
      src: ["/audio/Marry You.mp3"],
      loop: true,
      volume: 0.35,
      html5: true,
    });
    howlRef.current = howl;

    // Try to autoplay immediately
    howl.once("play", () => setIsPlaying(true));
    howl.play();

    // Fallback: if browser blocks autoplay, start on first user interaction
    const startOnInteraction = () => {
      if (howl && !howl.playing()) {
        howl.play();
        setIsPlaying(true);
      }
      cleanup();
    };

    const events = ["click", "touchstart", "scroll", "keydown"] as const;
    events.forEach((e) => document.addEventListener(e, startOnInteraction, { once: true, passive: true }));

    const cleanup = () => {
      events.forEach((e) => document.removeEventListener(e, startOnInteraction));
    };

    return () => {
      cleanup();
      howl.unload();
    };
  }, []);

  const play = useCallback(() => {
    const h = howlRef.current;
    if (!h || h.playing()) return;
    const muted = localStorage.getItem("aj-muted") === "true";
    if (muted) return;
    h.volume(0.35);
    h.play();
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;

    if (h.playing()) {
      h.pause();
      setIsPlaying(false);
      localStorage.setItem("aj-muted", "true");
    } else {
      h.volume(0.35);
      h.play();
      setIsPlaying(true);
      localStorage.setItem("aj-muted", "false");
    }
  }, []);

  const fadeOut = useCallback(() => {
    const h = howlRef.current;
    if (!h || !h.playing()) return;
    h.fade(0.35, 0, 2000);
    setTimeout(() => {
      h.pause();
      setIsPlaying(false);
    }, 2000);
  }, []);

  const pauseBg = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;
    wasPlayingRef.current = h.playing();
    if (h.playing()) {
      h.fade(0.35, 0, 500);
      setTimeout(() => {
        h.pause();
        setIsPlaying(false);
      }, 500);
    }
  }, []);

  const resumeBg = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;
    const muted = localStorage.getItem("aj-muted") === "true";
    if (wasPlayingRef.current && !muted) {
      h.volume(0);
      h.play();
      h.fade(0, 0.35, 500);
      setIsPlaying(true);
    }
  }, []);

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle, play, fadeOut, pauseBg, resumeBg }}>
      {children}
    </AudioCtx.Provider>
  );
}
