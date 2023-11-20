import { createComment } from "@/api/comments";
import { ResizeContainer } from "@/component/ResizeContainer";
import { CreateVideoComment, VideoComment } from "@/models/comment";
import type { Video } from "@/models/video";
import { AspectRatio } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  PointerEvent,
  ReactNode,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";

import { throttle } from "lodash";
import { VideoPin } from "./VideoPin";
import styles from "./VideoPlayer.module.css";

function getPointerPositionWithinElement(
  element: HTMLElement,
  event: PointerEvent<HTMLElement>
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  return { x: (left / rect.width) * 100, y: (top / rect.height) * 100 };
}

///

export enum VideoPlayerMode {
  Viewer,
  Editor,
}

type VideoPlayerProps = {
  mode: VideoPlayerMode;
  videoPayload: Video;
  videoComments: Array<VideoComment>;
};

const VideoPlayer = ({ videoPayload, videoComments }: VideoPlayerProps) => {
  //vars
  const [aw, ah] = [16, 9];

  //refs
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  //state
  const [comments, setComments] = useState<Array<VideoComment>>(videoComments);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [subtitlesShowing, setSubtitlesShowing] = useState(false);

  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [cursorTooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorTooltipContent, setCursorTooltipContent] =
    useState<ReactNode>(null);

  //queries + mutations
  const commentsMutation = useMutation({
    mutationFn: (requestBody: CreateVideoComment) => {
      return createComment(requestBody);
    },
  });

  const pauseVideo = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
  }, [videoRef]);
  const playVideo = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play();
  }, [videoRef]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, videoRef]);

  const handleVideoClick = useCallback(
    (e: PointerEvent<HTMLVideoElement>) => {
      if (!videoRef.current) return;

      if (isPlaying) {
        const { x, y } = getPointerPositionWithinElement(videoRef.current, e);
        const createCommentPayload: CreateVideoComment = {
          comment_text: "Some sort of comment seems appropriate",
          coordinates: { x, y },
          start_time: videoRef.current.currentTime,
          video_id: videoPayload.video_id,
        };
        commentsMutation.mutate(createCommentPayload, {
          onSuccess: (data) => setComments((prev) => [...prev, data]),
        });
      }
      togglePlayPause();
    },
    [isPlaying, commentsMutation]
  );

  const onVideoTimeUpdate = useCallback(
    throttle(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
      }
    }, 500),
    []
  );

  const handleReadyToPlay = () => {};

  const handlePointerMove = useCallback(
    throttle((e: PointerEvent<HTMLVideoElement>) => {
      if (videoRef.current) {
        const { x, y } = getPointerPositionWithinElement(videoRef.current, e);
        setTooltipPosition({ x, y });
      }
    }, 10),
    [videoRef]
  );
  const handlePointerLeave = () => {};

  const handleOnVideoPause = useCallback(() => {}, []);

  const handleOnVideoPlay = () => {};

  return (
    <ResizeContainer as="div">
      {({ width, height }) => (
        <>
          <AspectRatio
            ref={videoContainerRef}
            maw={`${(width * aw) / ah}px`}
            mah={`${width / (aw / ah)}px`}
            className={styles.video_player_wrapper}
            w={"100%"}
            pos={"relative"}
          >
            {/* <Svg innerWidth={width} innerHeight={height} aspectRatio={[aw, ah]}>
            {({ xScale, yScale }) => null}
          </Svg> */}
            <video
              className={styles.video}
              data-cursor={isPlaying ? "video-playing" : "video-paused"}
              controls
              ref={videoRef}
              disablePictureInPicture
              controlsList="nofullscreen"
              onClick={handleVideoClick}
              onTimeUpdate={onVideoTimeUpdate}
              onCanPlay={handleReadyToPlay}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPause={handleOnVideoPause}
              onPlay={handleOnVideoPlay}
              muted={isMuted}
              src={videoPayload.s3_url}
              style={{
                width,
                height,
              }}
            />
          </AspectRatio>
          {comments.map((comment) => (
            <VideoPin
              key={`${comment.comment_id}`}
              currentTime={currentTime}
              comment={comment}
            />
          ))}
          <CursorTooltip position={cursorTooltipPosition}>
            {isPlaying ? "click to comment" : "click to resume"}
          </CursorTooltip>
        </>
      )}
    </ResizeContainer>
  );
};

export { VideoPlayer };

interface CursorTooltipProps {
  position: { x: number; y: number };
  children: ReactNode;
}
const CursorTooltip = memo(({ position, children }: CursorTooltipProps) => {
  const TOOLTIP_WIDTH_IN_PX = 100;
  const TOOLTIP_HEIGHT_IN_PX = 50;

  const sign = position.x > 50 ? "-" : "+";

  return (
    <motion.div
      className={styles.cursor_tooltip}
      style={{
        transform: "translate(-50%, -50%)",
        width: `${TOOLTIP_WIDTH_IN_PX}px`,
        height: `${TOOLTIP_HEIGHT_IN_PX}px`,
        position: "absolute",
        left: `calc(${position.x}% ${sign} ${TOOLTIP_WIDTH_IN_PX}px)`,
        top: `calc(${position.y}%)`,
        pointerEvents: "none",
      }}
    >
      {children}
    </motion.div>
  );
});
