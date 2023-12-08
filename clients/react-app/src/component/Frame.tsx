import { CanvasMode, type CanvasState } from "@/types";
import { GradientPinkBlue } from "@visx/gradient";
import { Group } from "@visx/group";
import { ScaleLinear } from "d3";
import { motion } from "framer-motion";
import { ComponentProps, ReactNode, useCallback, useState } from "react";
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

type AudioArgs = {};

interface FrameProps {
  width: number;
  height: number;
  aspectRatio: [number, number];
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
  svgLayer,
  htmlLayer,
  canvasLayer,
}: FrameProps) => {

  const [canvasState, setState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const handleClickOutside = useCallback(() => { }, []);
  const handleMovePointer = useCallback(() => { }, []);

  return (
    <RelativeContainer zIndex={ZIndex.Zero}>
      <AbsoluteContainer
        id="svg-container"
        zIndex={ZIndex.Four}
        style={{ pointerEvents: "none" }}
      >
        <Svg innerWidth={width} innerHeight={height} aspectRatio={aspectRatio} pointerEvents={'all'}>
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
        style={{ pointerEvents: "all" }}
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
} & ComponentProps<typeof motion.div>;

const RelativeContainer = ({
  children,
  zIndex,
  style,
  ...props
}: RelativeContainerProps) => {
  return (
    <motion.div
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

type AbsoluteContainerProps = {
  zIndex: ZIndex;
  children: ReactNode;
} & ComponentProps<typeof motion.div>;

const AbsoluteContainer = ({
  children,
  zIndex,
  style,
  ...props
}: AbsoluteContainerProps) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        zIndex: zIndex,
        ...style,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
