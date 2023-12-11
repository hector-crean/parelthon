import { MediaAspectRatioContainer } from "@/component/ResizeContainer";
import dnaOutline from "@/data/dna-shape.json";
import { VideoComment } from "@/models/comment";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, memo, useMemo, useState } from "react";

import { Video } from "@/component/Video";
import { useAppContext } from "@/context/EditorContext";
import { useStageContext } from "@/context/StageContext";
import { Audio } from "@/models/audio";
import { AppState, EditState } from "@/models/canvas";
import type { Video as IVideo } from "@/models/video";
import { Frame } from "./Frame";
import styles from "./LayeredVideoPlayer.module.css";
import { Match } from "./Match";
import { OutlinePath } from "./OutlinePath";
import ToolsBar from "./ToolsBar";
import { Label } from "./labels/Label";

///

export enum VideoPlayerMode {
  Viewer,
  Editor,
}

type LayeredVideoPlayerProps = {
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

  const { appState, setAppState } = useAppContext();

  const {
    aspectRatio: [aw, ah],
    isPlaying,
    time,
  } = useStageContext();

  //state
  const [comments, setComments] = useState<Array<VideoComment>>(videoComments);
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  const dnaOutlineFn = () =>
    dnaOutline.map((point) => [point.x, point.y] as [number, number]);

  const dnaOutlineMemoed = useMemo(dnaOutlineFn, []);

  const renderCustorContent = ({
    state,
    isPlaying,
  }: {
    state: AppState;
    isPlaying: boolean;
  }) => {
    switch (state.kind) {
      case "edit":
        return "edit";
      case "view":
        return "view";
    }
  };

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
                  setCursorPosition={setCursorPosition}
                  setComments={setComments}
                  time={time}
                  appState={appState}
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
                      <CursorTooltip position={cursorPosition}>
                        {renderCustorContent({
                          state: appState,
                          isPlaying: isPlaying,
                        })}
                      </CursorTooltip>

                      {/* Video player */}
                      <Video
                        url={videoPayload.s3_url}
                        audioTracks={soundtrack}
                      />

                      {comments.map((comment) => (
                        <Label
                          key={`${comment.comment_id}`}
                          // currentTime={time}
                          comment={comment}
                          appState={appState}
                        />
                      ))}

                      <Match predicate={appState.kind === "edit"}>
                        <ToolsBar
                          editState={appState as EditState}
                          setEditState={setAppState}
                          undo={() => {}}
                          redo={() => {}}
                          canUndo={true}
                          canRedo={true}
                        />
                      </Match>
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
