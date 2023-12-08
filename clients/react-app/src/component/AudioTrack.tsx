import { useAudioNode } from "@/hooks/nodes";
import { Audio } from "@/models/audio";
import { Interval } from "@/models/interval";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as sac from "standardized-audio-context";
import { useAudioContextContext } from "../context/Audio";
import styles from "./AudioTrack.module.css";
import { FftDomain, Visualiser } from "./audio-nodes/Analyser/Visualiser";

interface AudioTrackProps {
  isPlaying: boolean;
  isSeeking: boolean;
  muted: boolean;
  track: Audio;
  //this is the master time (i.e. that of the video)
  videoTime: number;
  videoDuration: number;
}

export const AudioTrack = ({
  isPlaying,
  isSeeking,
  muted,
  track: { iv, src, id },
  videoTime,
  videoDuration,
}: AudioTrackProps) => {
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const audioContext = useAudioContextContext();
  const [audioBuf, setAudioBuf] = useState<sac.AudioBuffer | null>(null);
  const bufferSourceNodeRef =
    useRef<sac.AudioBufferSourceNode<sac.AudioContext> | null>(null);
  const gainNode = useAudioNode(
    "gain-node",
    (context) => context.createGain(),
    [src]
  );
  const analyserNode = useAudioNode(
    "analyser-node",
    (context) => context.createAnalyser(),
    [src]
  );

  // Combine fetching and decoding audio into a separate function
  useEffect(() => {
    let isCancelled = false;

    const fetchAndDecodeAudio = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        if (!isCancelled) {
          setAudioBuf(decodedAudio);
        }
        const bufferSourceNode = audioContext.createBufferSource();
        bufferSourceNodeRef.current?.disconnect();
        bufferSourceNode.buffer = audioBuf;
        bufferSourceNode.connect(gainNode);
        bufferSourceNodeRef.current = bufferSourceNode;
      } catch (error) {
        console.error("Error fetching or decoding audio:", error);
      }
    };

    fetchAndDecodeAudio();

    return () => {
      isCancelled = true;
      bufferSourceNodeRef?.current?.disconnect();
    };
  }, [src, audioContext]);

  useEffect(() => {
    gainNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    return () => {
      gainNode.disconnect();
      analyserNode.disconnect();
    };
  }, [gainNode, analyserNode, audioContext]);

  const relinkAndPlayBufferSource = useCallback(
    (
      bufferSourceNode: sac.IAudioBufferSourceNode<sac.IAudioContext>,
      time: number
    ) => {
      bufferSourceNodeRef.current?.disconnect();
      bufferSourceNode.buffer = audioBuf;
      bufferSourceNode.connect(gainNode);
      bufferSourceNode.start(0, time);
      bufferSourceNodeRef.current = bufferSourceNode;
    },
    [audioBuf, gainNode]
  );

  const handleAction = useCallback(
    (action: "play" | "pause", time?: number) => {
      if (action === "play" && time !== undefined) {
        const bufferSource = audioContext.createBufferSource();
        const dt = clamp(0, iv.end, time - iv.start);
        relinkAndPlayBufferSource(bufferSource, dt);
      } else if (action === "pause") {
        bufferSourceNodeRef.current?.stop();
      }
    },
    [relinkAndPlayBufferSource, iv, audioContext]
  );

  const inInterval = useMemo(
    () => intervalPredicateFn(videoTime, iv),
    [videoTime, iv]
  );

  useEffect(() => {
    if (inInterval && isPlaying) {
      if (!audioIsPlaying || isSeeking) {
        handleAction("play", videoTime);
        setAudioIsPlaying(true);
      }
    } else if (audioIsPlaying) {
      handleAction("pause");
      setAudioIsPlaying(false);
    }
  }, [
    inInterval,
    isPlaying,
    isSeeking,
    audioIsPlaying,
    handleAction,
    videoTime,
  ]);

  return (
    <motion.div
      className={styles.container}
      whileHover={{
        backgroundColor: "red",
        transition: { duration: 1 },
      }}
      whileTap={{ backgroundColor: "red" }}
      style={{
        height: "100%",
        position: "absolute",
        left: `${(iv.start / videoDuration) * 100}%`,
        width: `${((iv.end - iv.start) / videoDuration) * 100}%`,
      }}
    >
      <Visualiser
        node={analyserNode}
        paused={!isPlaying}
        type={FftDomain.TimeDomain}
        fillColor="blue"
      />
    </motion.div>
  );
};

// utils

const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(value, max));

const intervalPredicateFn = (time: number, { start, end }: Interval) =>
  time >= start && time <= end;
