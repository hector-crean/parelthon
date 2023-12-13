import useAnimationFrame from "@/hooks/useAnimationFrame";
import { VideoAudioItem } from "@/models/video-audio";
import { useVideoStageStore } from "@/stores/stage.store";
import { Slider, rem } from "@mantine/core";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import styles from "./AudioTimeBar.module.css";
import { AudioTrack } from "./AudioTrack";

interface Props {
  audioTracks: Array<VideoAudioItem>;
}

const AudioTimeBar = ({ audioTracks }: Props) => {
  const store = useVideoStageStore();

  const [internalTime, setInternalTime] = useState(0);

  // const draw = useCallback(() => {}, []);

  const tick = useCallback(() => {
    if (store.isPlaying) {
      setInternalTime(store.time);
    }
  }, [store.time, store.isPlaying]);

  useAnimationFrame(tick);

  // On seek, update UI time
  const handleSliderChange = useCallback((value: number) => {
    store.setIsSeeking(true);
    store.setTime(value);
    store.setTimeIsSynced(false);
  }, []);

  // On end seeking, update UI time and update video time
  const handleSliderCommit = useCallback((value: number) => {
    store.setTime(value);
    store.setIsSeeking(false);
    store.setTimeIsSynced(false);
  }, []);

  const [containerHovered, setContainerHovered] = useState(false);

  return (
    <motion.div
      className={styles.container}
      onHoverStart={() => setContainerHovered(true)}
      onHoverEnd={() => setContainerHovered(false)}
    >
      {audioTracks.map((track, i, arr) => (
        <AudioTrack
          key={`${track.id}-${i}-${track.src}`}
          track={track}
          muted={false}
          visualiserVisible={containerHovered}
          style={{
            height: "100%",
            position: "absolute",
            left: `${(track.iv.start / store.duration) * 100}%`,
            width: `${
              ((track.iv.end - track.iv.start) / store.duration) * 100
            }%`,
            borderLeft: `${i === 0 ? 2 : 0}px dashed black`,
            borderRight: `${2}px dashed black`,
          }}
        />
      ))}
      <Slider
        thumbSize={rem(25)}
        min={0}
        max={store.duration}
        value={internalTime}
        label={(v) => Math.round(v)}
        precision={4}
        step={0.1}
        onChange={handleSliderChange}
        onChangeEnd={handleSliderCommit}
        styles={(theme) => ({
          root: {
            width: "100%",
            position: "absolute",
            bottom: "50%",
            transform: "translate(0, 50%)",
            left: 0,
            right: 0,
            pointerEvents: "all",
          },

          track: {
            backgroundColor: theme.colors.dark[3],
            height: rem(2),
          },
          mark: {
            width: 6,
            height: 6,
            borderRadius: 6,
            transform: "translateX(-3px) translateY(-2px)",
            borderColor: theme.colors.dark[3],
          },
          markFilled: {
            borderColor: theme.colors.blue[6],
          },
          markLabel: {
            fontSize: theme.fontSizes.xs,
            marginBottom: 5,
            marginTop: 0,
          },
          thumb: {
            height: rem(2),
            width: rem(2),
            backgroundColor: theme.white,
            borderWidth: 1,
            boxShadow: theme.shadows.sm,
          },
        })}
      />
    </motion.div>
  );
};

export { AudioTimeBar };
