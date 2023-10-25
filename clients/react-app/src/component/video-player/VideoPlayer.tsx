import { AspectRatio } from "@mantine/core";
import { motion } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  PointerEventHandler,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import styles from "./video-player.module.css";

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isLooping: boolean;
  subtitlesShowing: boolean;

  volume: number;
  playbackRate: number;
  elapsedTime: number;
  cursorTooltipPosition: [number, number];
  cursorTooltipContent: ReactNode;
}
interface VideoPlayerUpdate {}

export enum VideoPlayerMode {
  Viewer,
  Editor,
}

type VideoPlayerProps = ComponentPropsWithoutRef<"video"> & {
  mode: VideoPlayerMode;
};

const VideoPlayer = ({ mode, ...videoProps }: VideoPlayerProps) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [subtitlesShowing, setSubtitlesShowing] = useState(false);

  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cursorTooltipPosition, setTooltipPosition] = useState([0, 0]);
  const [cursorTooltipContent, setCursorTooltipContent] =
    useState<ReactNode>(null);

  const [selectedComments, setSelectedComments] = useState<Array<string>>([]);

  const pauseVideo = () => {
    videoRef.current?.pause();
  };
  const playVideo = () => {
    videoRef.current?.play();
  };
  // utilites functions
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseVideo();
      setIsPlaying(false);
    } else {
      playVideo();
      setIsPlaying(true);
    }
  };

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (videoContainerRef.current) {
        videoContainerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // handlers
  const handleVideoPointerDown: PointerEventHandler<HTMLVideoElement> = (e) => {
    handlePlayPause();

    // video: playing:
    // 1. click on video: -> video pauses, and comment dialog is opened on point you clicked
    // -> typing in dialog, and pressing enter saves the comment
    // -> clicking away resumes the video, and minmises the comment
    // 2. click on comment: -> video paused, and comment opened up
    // video: paused:
    // clicking anywhere, bar on a comment, resumes the video, and minimises everything opened
  };

  const handleVideoTimeUpdate = () => {};

  const handleReadyToPlay = () => {};

  const handlePointerMove = () => {};

  const handlePointerLeave = () => {};

  const handleOnVideoPause = useCallback(() => {}, []);

  const handleOnVideoPlay = () => {};

  return (
    <AspectRatio
      ref={videoContainerRef}
      ratio={16 / 9}
      mx="auto"
      className={styles.video_player_wrapper}
    >
      <video
        {...videoProps}
        ref={videoRef}
        disablePictureInPicture
        controlsList="nofullscreen"
        onPointerDown={handleVideoPointerDown}
        onTimeUpdate={handleVideoTimeUpdate}
        onCanPlay={handleReadyToPlay}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPause={handleOnVideoPause}
        onPlay={handleOnVideoPlay}
        muted={isMuted}
      />
    </AspectRatio>
  );
};

export { VideoPlayer };

interface PinProps {
  x: number;
  y: number;
  timelineY: number;
}
const Pin = ({ x, y, timelineY }: PinProps) => {
  const pinVariants = {
    onVideo: { x: x, y: y },
    onTimeline: { x: x, y: timelineY },
  };

  return (
    <motion.circle
      layout
      initial="onVideo"
      variants={pinVariants}
    ></motion.circle>
  );
};
