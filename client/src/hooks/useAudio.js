import { useState } from "react";

export function useAudio() {
  const [focusEndSound] = useState(() => {
    const audio = new Audio("/sounds/focus-end.mp3");
    audio.preload = "auto";
    audio.load();
    return audio;
  });

  const [breakEndSound] = useState(() => {
    const audio = new Audio("/sounds/break-end.mp3");
    audio.preload = "auto";
    audio.load();
    return audio;
  });

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const unlockAudio = () => {
    if (audioUnlocked) return;
    focusEndSound
      .play()
      .then(() => {
        focusEndSound.pause();
        focusEndSound.currentTime = 0;
      })
      .catch(() => {});
    breakEndSound
      .play()
      .then(() => {
        breakEndSound.pause();
        breakEndSound.currentTime = 0;
      })
      .catch(() => {});
    setAudioUnlocked(true);
  };

  const playSound = (soundType, soundEnabled) => {
    if (!soundEnabled) return;
    const audio = soundType === "focus" ? focusEndSound : breakEndSound;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  return {
    unlockAudio,
    playSound,
  };
}
