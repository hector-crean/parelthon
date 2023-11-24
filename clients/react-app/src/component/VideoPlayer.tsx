import { createComment } from "@/api/comments";
import { ResizeContainer } from "@/component/ResizeContainer";
import { CreateVideoComment, VideoComment } from "@/models/comment";
import type { Video } from "@/models/video";
import { AspectRatio, Slider, rem } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  PointerEvent,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { throttle } from "lodash";
import { VideoPin } from "./VideoPin";
import styles from "./VideoPlayer.module.css";



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

  const [[aw, ah], setAspectRatio] = useState<[number, number]>([16, 9])

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

  useEffect(() => {
    if (!videoRef.current) return;
    // Check if the video metadata has loaded (necessary for accurate values)
    if (videoRef.current.readyState >= 2) {
      // Get the intrinsic width and height of the video
      const intrinsicWidth = videoRef.current.videoWidth;
      const intrinsicHeight = videoRef.current.videoHeight;
      console.log(intrinsicWidth, intrinsicHeight)
      setAspectRatio([intrinsicWidth, intrinsicHeight])

    }
  }, [videoRef.current])



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

  const handleSliderCommit = useCallback((value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);

    }
  }, []);


  const handleReadyToPlay = () => { };

  const handlePointerMove = useCallback(
    throttle((e: PointerEvent<HTMLVideoElement>) => {
      if (videoRef.current) {
        const { x, y } = getPointerPositionWithinElement(videoRef.current, e);
        setTooltipPosition({ x, y });
      }
    }, 10),
    [videoRef]
  );
  const handlePointerLeave = () => { };

  const handleOnVideoPause = useCallback(() => { }, []);

  const handleOnVideoPlay = () => { };

  return (
    <ResizeContainer as="div" className={styles.video_resize_container}>
      {({ width, height }) => (
        <AspectRatio
          ref={videoContainerRef}
          maw={`${(width * aw) / ah}px`}
          mah={`${width / (aw / ah)}px`}
          w={"100%"}
        >
          <div className={styles.video_player_wrapper}>
            <CursorTooltip position={cursorTooltipPosition}>
              {isPlaying ? "click to comment" : "click to resume"}
            </CursorTooltip>

            {/* Video player */}
            <video
              data-cursor={isPlaying ? "video-playing" : "video-paused"}
              controls={false}
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
            />
            {comments.map((comment) => (
              <VideoPin
                key={`${comment.comment_id}`}
                currentTime={currentTime}
                comment={comment}
              />
            ))}
            {/* Video controls */}
            <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
              <Slider

                // thumbSize={26}
                styles={{
                  root: { position: 'absolute', bottom: '0px', width: '100%', height: 'max-content' },
                  // label: {},
                  thumb: {
                    borderWidth: rem(2),
                    padding: rem(3)
                  },
                  trackContainer: {
                    backgroundColor: 'transparent',
                  },
                  track: {
                    backgroundColor: 'transparent',

                  },
                  bar: {
                    backgroundColor: 'transparent',

                  },

                  // markWrapper: {},
                  // mark: {},
                  // markLabel: {}

                }}
                thumbSize={rem(25)}
                min={0}
                max={duration}
                value={currentTime}
                precision={2}
                step={0.1}
                onChange={(v) => handleSliderCommit(v)}
                // marks={comments.map(c => ({ value: c.start_time, label: c.comment_id }))}
                thumbChildren={isPlaying ? <IconPlayerPause size={rem(1)} onPointerDown={togglePlayPause} /> : <IconPlayerPlay size={rem(1)} onPointerDown={togglePlayPause} />}

              />
            </div>
          </div>
        </AspectRatio>
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



//utils

function getPointerPositionWithinElement(
  element: HTMLElement,
  event: PointerEvent<HTMLElement>
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  return { x: (left / rect.width) * 100, y: (top / rect.height) * 100 };
}