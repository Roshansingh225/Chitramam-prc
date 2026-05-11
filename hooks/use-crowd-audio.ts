"use client";

import { useCallback, useRef } from "react";

export function useCrowdAudio() {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!contextRef.current) {
      contextRef.current = new window.AudioContext();
    }

    return contextRef.current;
  }, []);

  const playReveal = useCallback(() => {
    const context = getContext();

    if (!context) {
      return;
    }

    const duration = 1.5;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.4);
    oscillator.frequency.exponentialRampToValueAtTime(220, now + duration);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(840, now);
    filter.Q.setValueAtTime(1.4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }, [getContext]);

  return { playReveal };
}
