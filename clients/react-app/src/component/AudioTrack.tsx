import { useAudioNode } from "@/hooks/nodes";
import { Interval } from "@/models/interval";
import { VideoAudioItem } from "@/models/video-audio";
import { useVideoStageStore } from "@/stores/stage.store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as sac from "standardized-audio-context";
import { useAudioContextContext } from "../context/Audio";
import styles from "./AudioTrack.module.css";
import { FftDomain, Visualiser } from "./audio-nodes/Analyser/Visualiser";

interface AudioTrackProps extends ComponentProps<typeof motion.div> {
  muted: boolean;
  track: VideoAudioItem;
  visualiserVisible: boolean;
}

export const AudioTrack = ({
  muted,
  track: { iv, src, id },
  visualiserVisible,
  ...props
}: AudioTrackProps) => {
  const store = useVideoStageStore();
  const audioContext = useAudioContextContext();

  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
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

  //mute the sound (by setting gain node to zero) if muting is enabled
  //This is useful if we want to visualise the sounds, but not hear it
  // useEffect(
  //   () =>
  //     void gainNode.gain.setTargetAtTime(
  //       muted === true ? 0 : 1,
  //       audioContext.currentTime,
  //       0.015
  //     ),
  //   [gainNode, muted]
  // );

  // Fetch and decode audio
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

  // Connect audio nodes
  useEffect(() => {
    gainNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    return () => {
      // Disconnect nodes in the reverse order of connection
      analyserNode.disconnect();
      gainNode.disconnect();
    };
  }, [gainNode, analyserNode, audioContext]);

  useEffect(() => {
    analyserNode.disconnect(audioContext.destination);
  }, [muted == true]);
  useEffect(() => {
    analyserNode.connect(audioContext.destination);
  }, [muted == false]);

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

  type Action = { type: "play"; time: number } | { type: "pause" };

  const handleAction = useCallback(
    (action: Action) => {
      switch (action.type) {
        case "play":
          const bufferSource = audioContext.createBufferSource();
          const dt = clamp(0, iv.end, action.time - iv.start);
          relinkAndPlayBufferSource(bufferSource, dt);
          break;
        case "pause":
          try {
            bufferSourceNodeRef.current?.stop();
          } catch (e) {
            console.log(
              "audio node could not be stopped, perhaps because it has not been started"
            );
          }
          break;
      }
    },
    [relinkAndPlayBufferSource, iv, audioContext]
  );

  const inInterval = useMemo(
    () => intervalPredicateFn(store.time, iv),
    [store.time, iv]
  );

  // Check if we should play or pause the audio based on time and state
  useEffect(() => {
    const shouldPlay = inInterval && store.isPlaying;

    if (shouldPlay && !audioIsPlaying) {
      handleAction({ type: "play", time: store.time });
      setAudioIsPlaying(true);
    } else if (!shouldPlay && audioIsPlaying) {
      handleAction({ type: "pause" });
      setAudioIsPlaying(false);
    }
  }, [
    inInterval,
    store.isPlaying,
    store.isSeeking,
    audioIsPlaying,
    handleAction,
    store.time,
  ]);

  return (
    <motion.div
      className={styles.audiotrack_container}
      onClick={() => {
        store.setIsPlaying(true);
        store.setTime(iv.start);
        store.setTimeIsSynced(false);
      }}
      whileHover={{
        backgroundColor: "red",
        transition: { duration: 1 },
      }}
      whileTap={{ backgroundColor: "red" }}
      {...props}
    >
      <div className={styles.relative_container}>
        <div className={styles.audiotrack_label}>{id}</div>
        <AnimatePresence>
          {visualiserVisible && (
            <Visualiser
              node={analyserNode}
              paused={!store.isPlaying}
              type={FftDomain.TimeDomain}
              fillColor="#398ae6"
              containerProps={{
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// utils

const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(value, max));

const intervalPredicateFn = (time: number, { start, end }: Interval) =>
  time >= start && time <= end;
