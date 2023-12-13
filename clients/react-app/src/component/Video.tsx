import { VideoAudioItem } from "@/models/video-audio";
import { useVideoStageStore } from "@/stores/stage.store";
import { ComponentProps, useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { AudioTimeBar } from "./AudioTimeBar";
import styles from "./Video.module.css";

type VideoProps = {
  url: string;
  audioTracks: Array<VideoAudioItem>;
} & ComponentProps<typeof ReactPlayer>;

const Video = ({ url, audioTracks = [], ...props }: VideoProps) => {
  const store = useVideoStageStore();

  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  //handlers

  const handleProgress = useCallback(
    (progress: OnProgressProps) => {
      if (!store.isSeeking) {
        store.setTime(progress.playedSeconds);
      }
    },
    [store.isSeeking]
  );

  const handleEnded = useCallback(() => {
    store.setTime(store.duration);
    store.setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (wrapperRef.current) {
      const videoRef = wrapperRef.current.querySelector("video");
      if (videoRef) {
        // Check if the video metadata has loaded (necessary for accurate values)
        if (videoRef.readyState >= 2) {
          // Get the intrinsic width and height of the video
          const intrinsicWidth = videoRef.videoWidth;
          const intrinsicHeight = videoRef.videoHeight;
          store.setAspectRatio([intrinsicWidth, intrinsicHeight]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(store.time, "seconds");
    }
    store.setTimeIsSynced(true);
  }, [store.timeIsSynced === true]);

  return (
    <div
      className={styles.player_wrapper}
      onClick={() => store.togglePlayPause()}
      ref={wrapperRef}
    >
      <ReactPlayer
        muted={true}
        ref={playerRef}
        width="100%"
        height={"100%"}
        style={{ objectFit: "cover" }}
        playing={store.isPlaying}
        onDuration={store.setDuration}
        onProgress={handleProgress}
        progressInterval={100}
        onEnded={handleEnded}
        // onBuffer={() => store.setMode({ mode: "buffering" })}
        // onBufferEnd={() => store.setMode({ mode: "paused" })}
        // onReady={() => store.setIsPlaying(true)}
        url={url}
        className={styles.react_player}
        {...props}
      />
      <div className={styles.timebar}>
        <AudioTimeBar audioTracks={audioTracks} />
      </div>
    </div>
  );
};

export { Video };
