"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type AudioContextType = {
  isSoundOn: boolean;
  toggleSound: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

const TARGET_VOLUME = 0.12;
const FADE_IN_DURATION = 800;
const FADE_OUT_DURATION = 500;
const FADE_INTERVAL = 30;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ensureAmbientAudio = useCallback(() => {
    if (ambientAudioRef.current) return ambientAudioRef.current;
    const audio = document.createElement("audio");
    audio.src = "/wics_audio.mp3";
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;
    ambientAudioRef.current = audio;
    return audio;
  }, []);

  const fadeVolume = useCallback(
    (target: number, duration: number, onComplete?: () => void) => {
      const audio = ambientAudioRef.current;
      if (!audio) {
        onComplete?.();
        return;
      }

      if (fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      const startVol = audio.volume;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - t) * (1 - t);
        const vol = startVol + (target - startVol) * eased;
        audio.volume = Math.max(0, Math.min(1, vol));

        if (t >= 1) {
          if (fadeTimerRef.current) {
            clearInterval(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
          audio.volume = target;
          if (target === 0) {
            audio.pause();
            audio.currentTime = 0;
          }
          onComplete?.();
        }
      };

      fadeTimerRef.current = setInterval(step, FADE_INTERVAL);
      step();
    },
    []
  );

  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => {
      const next = !prev;
      if (next) {
        const audio = ensureAmbientAudio();
        audio.muted = false;
        audio.volume = 0;
        audio.play().catch(() => {});
        fadeVolume(TARGET_VOLUME, FADE_IN_DURATION);
      } else {
        fadeVolume(0, FADE_OUT_DURATION);
      }
      return next;
    });
  }, [ensureAmbientAudio, fadeVolume]);

  return (
    <AudioContext.Provider value={{ isSoundOn, toggleSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
