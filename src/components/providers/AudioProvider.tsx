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
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: false,
  toggle: () => {},
  play: () => {},
  fadeOut: () => {},
});

export const useAudio = () => useContext(AudioCtx);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const muted = localStorage.getItem("aj-muted") === "true";

    howlRef.current = new Howl({
      src: ["/audio/romantic-piano.webm"],
      loop: true,
      volume: muted ? 0 : 0.35,
      html5: true,
    });

    return () => {
      howlRef.current?.unload();
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

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle, play, fadeOut }}>
      {children}
    </AudioCtx.Provider>
  );
}
