import { Audio } from "@/models/audio";
import { Interval } from "@/models/interval";

import { Howl } from "howler";

import { useCallback, useEffect, useMemo, useRef } from "react";

interface AudioTrackProps {
  isPlaying: boolean;
  isSeeking: boolean;
  muted: boolean;
  track: Audio;
  //this is the master time (i.e. that of the video)
  time: number;
}

export const AudioTrack = ({
  isPlaying,
  isSeeking,
  muted,
  track: { iv, src, id },
  time,
}: AudioTrackProps) => {
  const soundRef = useRef<Howl>();

  const inInterval = useMemo(
    () => intervalPredicateFn(time, iv),
    [time, iv.start, iv.end]
  );

  //setup
  useEffect(() => {
    soundRef.current = new Howl({ src });
  }, []);

  useEffect(() => {
    switch (inInterval && isPlaying) {
      case true:
        handleSeek(iv, time);
        handlePlay();
        break;
      case false:
        handlePause();
        break;
    }
  }, [inInterval, isPlaying]);

  useEffect(() => {
    handleSeek(iv, time);
  }, [isSeeking]);

  const handlePlay = () => {
    if (!soundRef.current) return;

    soundRef.current?.play();
  };

  const handlePause = () => {
    if (!soundRef.current) return;

    if (soundRef.current.playing()) {
      soundRef.current?.pause();
    }
  };

  const handleSeek = useCallback((iv: Interval, time: number) => {
    if (!soundRef.current) return;
    // T1                    time (t)                         T2
    // |------------------------------------------------------| video clip
    //                    |-------| audio clip
    //                   t1       t2
    // 0                 3        6                          21
    //  <---  t1 - T1 --->
    const dt = clamp(0, iv.end, time - iv.start);
    soundRef.current.seek(dt);
  }, []);

  return null;
};

// utils

const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(value, max));

const intervalPredicateFn = (time: number, { start, end }: Interval) =>
  time >= start && time <= end;
