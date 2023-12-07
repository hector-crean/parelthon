import { createComment } from "@/api/comments";
import { MediaAspectRatioContainer } from "@/component/ResizeContainer";
import { CreateVideoComment, VideoComment } from "@/models/comment";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  PointerEvent,
  ReactNode,
  memo,
  useCallback,
  useRef,
  useState
} from "react";


import { Video } from '@/component/Video';
import { useStageContext } from "@/context/StageContext";
import { Audio } from "@/models/audio";
import type { Video as IVideo } from "@/models/video";
import { CanvasMode, CanvasState } from "@/types";
import { throttle } from "lodash";
import { Frame } from "./Frame";
import { OutlinePath } from "./OutlinePath";
import styles from "./VideoPlayer.module.css";
import { Label } from "./labels/Label";

///





export enum VideoPlayerMode {
  Viewer,
  Editor,
}

type VideoPlayerProps = {
  mode: VideoPlayerMode;
  videoPayload: IVideo;
  videoComments: Array<VideoComment>;
  changeVideo: (videoId: string) => void;
  nextVideo: IVideo;
  prevVideo: IVideo;
  soundtrack: Array<Audio>;
};

const VideoPlayer = ({
  videoPayload,
  videoComments,
  changeVideo,
  nextVideo,
  soundtrack,
}: VideoPlayerProps) => {
  //refs
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { aspectRatio: [aw, ah], isPlaying, time } = useStageContext()

  //state
  const [comments, setComments] = useState<Array<VideoComment>>(videoComments);
  const [cursorTooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  const [cursorTooltipContent, setCursorTooltipContent] =
    useState<ReactNode>(null);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  //queries + mutations



  const commentsMutation = useMutation({
    mutationFn: (requestBody: CreateVideoComment) => {
      return createComment(requestBody);
    },
  });



  const handlePointerMove = useCallback(
    throttle((e: PointerEvent<HTMLVideoElement>) => {
      if (videoRef.current) {
        const { x, y } = getPointerPositionWithinElement(videoRef.current, e);
        setTooltipPosition({ x, y });
      }
    }, 100),
    [videoRef]
  );

  return (
    <AnimatePresence>
      {true && (
        <>
          <motion.div
            style={{ width: "100%", height: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MediaAspectRatioContainer aspectRatio={[aw, ah]}>
              {({ width, height }) => (
                <Frame
                  width={width}
                  height={height}
                  aspectRatio={[aw, ah]}
                  svgLayer={({ xScale, yScale }) => (

                    <g>
                      <OutlinePath
                        xScale={xScale}
                        yScale={yScale}
                        points={[
                          [1, 0],
                          [0.3, 0.3],
                          [0.9, 0.4],
                          [0.3, 0.2],

                          [1, 0],
                        ]}
                      />
                    </g>
                  )}
                  canvasLayer={() => null}
                  htmlLayer={() => (
                    <>
                      <CursorTooltip position={cursorTooltipPosition}>
                        {isPlaying ? "click to comment" : "click to resume"}
                      </CursorTooltip>

                      {/* Video player */}
                      <Video
                        url={videoPayload.s3_url}
                        audioTracks={soundtrack}
                        onPointerMove={handlePointerMove}
                      />


                      {comments.map((comment) => (
                        <Label
                          key={`${comment.comment_id}`}
                          currentTime={time}
                          comment={comment}
                        />
                      ))}



                      {/* Video controls */}
                      {/* <ToolsBar
                        canvasState={canvasState}
                        setCanvasState={setCanvasState}
                        undo={() => { }}
                        redo={() => { }}
                        canUndo={true}
                        canRedo={true}
                      /> */}


                    </>
                  )}
                />
              )}
            </MediaAspectRatioContainer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
