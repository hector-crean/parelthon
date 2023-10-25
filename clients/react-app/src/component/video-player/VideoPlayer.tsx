import { createComment, getCommentsByVideoId } from "@/api/comments";
import { ResizeContainer } from "@/component/resize-container";
import { CreateVideoComment } from "@/models/comment";
import type { Video } from "@/models/video";
import { AspectRatio } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  PointerEvent,
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
  video: Video;
};

const VideoPlayer = ({ mode, video, ...videoProps }: VideoPlayerProps) => {
  const CONTAINER_WIDTH = 300;
  const [aw, ah] = [16, 9];

  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const commentsMutation = useMutation({
    mutationFn: (requestBody: CreateVideoComment) => {
      return createComment(requestBody);
    },
  });

  const commentsQuery = useQuery({
    queryKey: [`comments:${video.video_id}`],
    queryFn: () => getCommentsByVideoId(video.video_id),
  });

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

  const getCurrentTime = () => videoRef.current?.currentTime ?? 0;

  function getPointerPositionWithinElement(
    element: HTMLElement,
    event: PointerEvent<HTMLElement>
  ): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;

    return { x: (left / rect.width) * 100, y: (top / rect.height) * 100 };
  }

  // handlers
  const handleVideoPointerDown: PointerEventHandler<HTMLVideoElement> = (e) => {
    handlePlayPause();

    if (videoRef.current) {
      commentsMutation.mutate({
        comment_text: "Some sort of comment seems appropriate",
        coordinates: getPointerPositionWithinElement(videoRef.current, e),
        start_time: getCurrentTime(),
        video_id: video.video_id,
      });
    }

    commentsQuery.refetch();

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
    <ResizeContainer as="div">
      {({ width, height }) => (
        <AspectRatio
          ref={videoContainerRef}
          maw={`${(width * aw) / ah}px`}
          mah={`${width / (aw / ah)}px`}
          className={styles.video_player_wrapper}
          w={"100%"}
          pos={"relative"}
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
            src={video.s3_url}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
            }}
          />
          {commentsQuery.data?.map(({ screen_x, screen_y }) => (
            <div
              style={{
                position: "absolute",
                left: `${screen_x}%`,
                top: `${screen_y}%`,
                backgroundColor: "red",
                width: "40px",
                height: "40px",
              }}
            ></div>
          ))}
        </AspectRatio>
      )}
    </ResizeContainer>
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
