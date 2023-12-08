import { createComment } from "@/api/comments";
import { MediaAspectRatioContainer } from "@/component/ResizeContainer";
import dnaOutline from '@/data/dna-shape.json';
import { CreateVideoComment, VideoComment } from "@/models/comment";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  PointerEvent,
  ReactNode,
  memo,
  useMemo,
  useState
} from "react";

import { Video } from '@/component/Video';
import { useStageContext } from "@/context/StageContext";
import { Audio } from "@/models/audio";
import type { Video as IVideo } from "@/models/video";
import { CanvasMode, CanvasState } from "@/types";
import { Frame } from "./Frame";
import styles from "./LayeredVideoPlayer.module.css";
import { OutlinePath } from "./OutlinePath";
import { Label } from "./labels/Label";

///





export enum VideoPlayerMode {
  Viewer,
  Editor,
}

type LayeredVideoPlayerProps = {
  mode: VideoPlayerMode;
  videoPayload: IVideo;
  videoComments: Array<VideoComment>;
  changeVideo: (videoId: string) => void;
  nextVideo: IVideo;
  prevVideo: IVideo;
  soundtrack: Array<Audio>;
};

const LayeredVideoPlayer = ({
  videoPayload,
  videoComments,
  changeVideo,
  nextVideo,
  soundtrack,
}: LayeredVideoPlayerProps) => {
  //refs

  const { aspectRatio: [aw, ah], isPlaying } = useStageContext()

  console.log(aw, ah)


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


  // const handlePointerMove = useCallback(
  //   throttle((e: PointerEvent<HTMLVideoElement>) => {
  //     if (videoRef.current) {
  //       const { x, y } = getPointerPositionWithinElement(videoRef.current, e);
  //       setTooltipPosition({ x, y });
  //     }
  //   }, 100),
  //   [videoRef]
  // );

  const dnaOutlineFn = () => dnaOutline.map(point => ([point.x, point.y]));

  const dnaOutlineMemoed = useMemo(dnaOutlineFn, [])

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
                        points={dnaOutlineMemoed}
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
                        onPointerMove={() => { }}
                      />


                      {comments.map((comment) => (
                        <Label
                          key={`${comment.comment_id}`}
                          // currentTime={time}
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

export { LayeredVideoPlayer };

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
