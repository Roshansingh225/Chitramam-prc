"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech() {
  const [enabled, setEnabled] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !enabled || !text) {
        return;
      }

      stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.9;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [enabled, stop]
  );

  useEffect(() => stop, [stop]);

  return {
    enabled,
    setEnabled,
    speak,
    stop
  };
}
