import { useStageContext } from "@/context/StageContext";
import { Audio } from "@/models/audio";
import { ComponentProps, useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { AudioTimeBar } from "./AudioTimeBar";
import styles from "./Video.module.css";

type VideoProps = { url: string; audioTracks: Array<Audio> } & ComponentProps<
  typeof ReactPlayer
>;

const Video = ({ url, audioTracks = [], ...props }: VideoProps) => {
  const {
    time,
    setTime,
    duration,
    isPlaying,
    setIsPlaying,
    setDuration,
    setIsSeeking,
    isSeeking,
    setAspectRatio,
  } = useStageContext();

  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  //handlers

  const handleProgress = useCallback(
    (progress: OnProgressProps) => {
      if (!isSeeking) {
        setTime(progress.playedSeconds);
      }
    },
    [isSeeking]
  );

  // On seek, update UI time
  const handleSliderChange = useCallback((value: number) => {
    setIsSeeking(true);
    setTime(value);
  }, []);

  // On end seeking, update UI time and update video time
  const handleSliderCommit = useCallback((value: number) => {
    setTime(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, "seconds");
    }
    setIsSeeking(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
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
          setAspectRatio([intrinsicWidth, intrinsicHeight]);
        }
      }
    }
  }, []);

  return (
    <div
      className={styles.player_wrapper}
      onClick={() => setIsPlaying(!isPlaying)}
      ref={wrapperRef}
    >
      <ReactPlayer
        muted={true}
        ref={playerRef}
        width="100%"
        height="auto"
        playing={isPlaying}
        onDuration={setDuration}
        onProgress={handleProgress}
        progressInterval={200}
        onEnded={handleEnded}
        url={url}
        className={styles.react_player}
        {...props}
      />
      <div className={styles.timebar}>
        <AudioTimeBar
          time={time}
          handleSliderChange={handleSliderChange}
          handleSliderCommit={handleSliderCommit}
          duration={duration}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isSeeking={isSeeking}
          audioTracks={audioTracks}
        />
      </div>
    </div>
  );
};

export { Video };
