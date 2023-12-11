import { createComment } from "@/api/comments";
import { AppState, EditMode } from "@/models/canvas";
import { CreateVideoComment, VideoComment } from "@/models/comment";
import { useMutation } from "@tanstack/react-query";
import { GradientPinkBlue } from "@visx/gradient";
import { Group } from "@visx/group";
import { ScaleLinear } from "d3";
import { throttle } from "lodash";
import {
  ComponentProps,
  Dispatch,
  PointerEvent,
  ReactNode,
  SetStateAction,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Svg } from "./Svg";

enum ZIndex {
  Zero = 0, // 00000000
  One = 1 << 0, // 00000001
  Two = 1 << 1, // 00000010
  Three = 1 << 2, // 00000100
  Four = 1 << 3, // 00001000
  Five = 1 << 4, // 00010000
  Six = 1 << 5, // 00100000
  Seven = 1 << 6, // 01000000
  Eight = 1 << 7, // 10000000
}

const BG_PATTERN_ID = "bg-pattern";

type SvgLayerArgs = {
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
};
type CanvasLayerArgs = {};
type HtmlLayerArgs = {};

interface FrameProps extends ComponentProps<"div"> {
  width: number;
  height: number;
  aspectRatio: [number, number];
  setCursorPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setComments: Dispatch<SetStateAction<Array<VideoComment>>>;
  time: number;
  appState: AppState;
  svgLayer: (args: {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  }) => ReactNode;
  htmlLayer: (args: HtmlLayerArgs) => ReactNode;
  canvasLayer: (args: CanvasLayerArgs) => ReactNode;
}

const Frame = ({
  width,
  height,
  aspectRatio,
  time,
  appState,
  svgLayer,
  htmlLayer,
  canvasLayer,
  setCursorPosition,
  setComments,
  ...props
}: FrameProps) => {
  const htmlFrameRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {}, []);
  const handleMovePointer = useCallback(() => {}, []);

  const handlePointerMove = useCallback(
    throttle((e: PointerEvent<HTMLDivElement>) => {
      if (htmlFrameRef.current) {
        const { x, y } = getPointerPositionWithinElement(
          htmlFrameRef.current,
          e
        );
        setCursorPosition({ x, y });
      }
    }, 100),
    [htmlFrameRef]
  );

  const commentsMutation = useMutation({
    mutationFn: (requestBody: CreateVideoComment) => {
      return createComment(requestBody);
    },
  });

  const handleAddComment = (e: PointerEvent<HTMLDivElement>) => {
    if (appState.kind === "edit" && appState.mode === EditMode.Inserting) {
      if (htmlFrameRef.current) {
        const reqBody: CreateVideoComment = {
          comment_text: "a comment",
          coordinates: getPointerPositionWithinElement(htmlFrameRef.current, e),
          start_time: time,
          end_time: time + 2,
        };
        const comment: VideoComment = {
          comment_id: uuidv4(),
          screen_x: reqBody.coordinates.x,
          screen_y: reqBody.coordinates.y,
          start_time: reqBody.start_time,
          end_time: reqBody.end_time,
          comment_text: reqBody.comment_text,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        commentsMutation.mutate(reqBody);
        setComments((prevComments) => {
          return [...prevComments, comment];
        });
      }
    }
  };

  return (
    <RelativeContainer zIndex={ZIndex.Zero} {...props}>
      <AbsoluteContainer
        id="svg-container"
        zIndex={ZIndex.Four}
        style={{ pointerEvents: "none" }}
      >
        <Svg
          innerWidth={width}
          innerHeight={height}
          aspectRatio={aspectRatio}
          pointerEvents={"all"}
        >
          {({ xScale, yScale, margin }) => (
            <>
              <GradientPinkBlue id={BG_PATTERN_ID} />
              {/* background */}
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="transparent"
                onPointerMove={handleMovePointer}
                onPointerLeave={handleClickOutside}
                // onPointerDown={handleClickOutside}
                // onPointerMove={handleMovePointer}
              />
              {/* background */}
              <rect
                x={margin.left}
                y={margin.top}
                width={width}
                height={height}
                fill={`url(#${BG_PATTERN_ID})`}
                fillOpacity={0.3}
                pointerEvents={"none"}
                //   animate={{ stdDeviation: isHovered ? 0 : 10 }}
                // filter="url(#my-filter)"
              />

              <Group top={margin.top} left={margin.left}>
                {svgLayer({ xScale, yScale })}
              </Group>
            </>
          )}
        </Svg>
      </AbsoluteContainer>
      <AbsoluteContainer
        id="html-container"
        zIndex={ZIndex.Two}
        // style={{ pointerEvents: "all" }}
        ref={htmlFrameRef}
        onPointerMove={handlePointerMove}
        onClick={handleAddComment}
      >
        {htmlLayer({})}
      </AbsoluteContainer>
      <AbsoluteContainer
        id="canvas-container"
        zIndex={ZIndex.Three}
        style={{ pointerEvents: "none" }}
      >
        {canvasLayer({})}
      </AbsoluteContainer>
    </RelativeContainer>
  );
};

export { Frame };

type RelativeContainerProps = {
  zIndex: ZIndex;
  children: ReactNode;
} & ComponentProps<"div">;

const RelativeContainer = ({
  children,
  zIndex,
  style,
  ...props
}: RelativeContainerProps) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        zIndex: zIndex,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

type AbsoluteContainerProps = {
  zIndex: ZIndex;
  children: ReactNode;
} & React.ComponentPropsWithRef<"div">;

const AbsoluteContainer = forwardRef<HTMLDivElement, AbsoluteContainerProps>(
  ({ children, zIndex, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: zIndex,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

function getPointerPositionWithinElement(
  element: HTMLElement,
  event: PointerEvent<HTMLElement>
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  return { x: (left / rect.width) * 100, y: (top / rect.height) * 100 };
}
