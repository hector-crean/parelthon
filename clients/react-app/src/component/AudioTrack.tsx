import { Audio } from "@/models/audio";
import { create } from "zustand";

// Define the state shape and actions
type AudioState = {
  muted: boolean;
};
type AudioUpdate = {
  mute: () => void;
  unmute: () => void;
};

export const useAudioStore = create<AudioState & AudioUpdate>((set, get) => ({
  muted: false,
  mute: () => set({ muted: true }),
  unmute: () => set({ muted: false }),
}));

import { Howl } from "howler";

import { useEffect, useMemo, useRef } from "react";

interface AudioTrackProps {
  track: Audio;
  absoluteTime: number;
}

export const AudioTrack = ({
  track: {
    iv: { start, end },
    src,
    id,
  },
  absoluteTime,
}: AudioTrackProps) => {
  const { muted, mute, unmute } = useAudioStore();

  const soundRef = useRef<Howl>();

  //setup
  useEffect(() => {
    soundRef.current = new Howl({ src });
  }, [src]);

  const inInterval = useMemo(
    () =>
      start
        ? end
          ? absoluteTime >= start && absoluteTime < end
          : absoluteTime >= start
        : true,
    [absoluteTime, start, end, src]
  );

  const handlePlayPause = () => {
    if (!soundRef.current) return;

    if (inInterval && !muted) {
      // |-------------------------------------------------| video clip
      //             |-------| audio clip
      const dt_seconds = clamp(
        start - absoluteTime,
        end - absoluteTime,
        absoluteTime
      );
      const soundId = soundRef.current.seek(dt_seconds * 1000);
      soundRef.current.play(soundId);
    } else {
      soundRef.current?.pause();
    }
  };

  useEffect(() => {
    handlePlayPause();
  }, [inInterval, muted]);

  return null;
};

const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(value, max));
