import { Margin } from "@/models/margin";
import { CanvasMode, type CanvasState } from "@/types";
import { Group } from "@visx/group";
import { ScaleLinear } from "@visx/vendor/d3-scale";
import { curveCatmullRom, line } from "d3";
import { motion } from "framer-motion";
import { ReactNode, useCallback, useState } from "react";
import { Svg } from "./Svg";

const BG_PATTERN_ID = "bg-pattern";

interface FrameProps {
  width: number;
  height: number;
  aspectRatio: [number, number];
  svgLayer: ReactNode;
  htmlLayer: ReactNode;
  canvasLayer: ReactNode;
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

  const handleClickOutside = useCallback(() => {}, []);
  const handleMovePointer = useCallback(() => {}, []);

  return (
    <RelativeContainer>
      <AbsoluteContainer>
        <Svg innerWidth={width} innerHeight={height} aspectRatio={aspectRatio}>
          {({ xScale, yScale, margin }) => (
            <>
              <defs></defs>
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
              <motion.rect
                x={margin.left}
                y={margin.top}
                width={innerWidth}
                height={innerHeight}
                fill={`url(#${BG_PATTERN_ID})`}
                fillOpacity={0.3}
                pointerEvents={"none"}
                initial={false}
                //   animate={{ stdDeviation: isHovered ? 0 : 10 }}
                filter="url(#my-filter)"
              />

              <Group top={margin.top} left={margin.left}>
                {svgLayer}
              </Group>
            </>
          )}
        </Svg>
      </AbsoluteContainer>

      <AbsoluteContainer>{htmlLayer}</AbsoluteContainer>
      <AbsoluteContainer>{htmlLayer}</AbsoluteContainer>
      <AbsoluteContainer>{canvasLayer}</AbsoluteContainer>
    </RelativeContainer>
  );
};

export { Frame };

const RelativeContainer = ({ children }: { children: ReactNode }) => {
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
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};

const AbsoluteContainer = ({
  children,
  margin,
}: {
  children: ReactNode;
  margin?: Margin;
}) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        // margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};

interface OutlinePathsProps {
  maskGradientPoints: Array<[number, number]>;
  maskPoints: Array<[number, number]>;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}
const OutlinePath = ({
  maskGradientPoints,
  maskPoints,
  xScale,
  yScale,
}: OutlinePathsProps) => {
  const accessorX = (d: [number, number]) => xScale(d[0]);
  const accessorY = (d: [number, number]) => yScale(d[1]);

  const pathFn = line()
    .x(accessorX)
    .y(accessorY)
    .curve(curveCatmullRom.alpha(0.5));

  return (
    <>
      <radialGradient
        id="gradient"
        cx="0"
        cy="0"
        r="267"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(491.25,402)"
      >
        <stop offset="0" stop-color="white" stop-opacity="0"></stop>
        <stop offset="0.25" stop-color="white" stop-opacity="0.7"></stop>
        <stop offset="0.5" stop-color="white" stop-opacity="0"></stop>
        <stop offset="0.75" stop-color="white" stop-opacity="0.7"></stop>
        <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        <animateTransform
          attributeName="gradientTransform"
          attributeType="XML"
          type="scale"
          from="0"
          to="12"
          dur="1.5s"
          begin=".3s"
          fill="freeze"
          additive="sum"
        ></animateTransform>
      </radialGradient>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="2"
          flood-color="#1d85bb"
        ></feDropShadow>
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="4"
          flood-color="#1d85bb"
        ></feDropShadow>
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="6"
          flood-color="#1d85bb"
        ></feDropShadow>
      </filter>

      <clipPath id="clip-path">
        <path d="" />
      </clipPath>

      <path
        id="mask-gradient"
        className="mask-gradient"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity="0"
        fill-opacity="1"
        fill="url(#gradient)"
        d={pathFn(maskGradientPoints) ?? ""}
      ></path>
      <path
        id="mask-path"
        className="mask-path"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity=".8"
        fill-opacity="0"
        stroke="#1d85bb"
        stroke-width="3"
        filter="url(#glow)"
        d={pathFn(maskPoints) ?? ""}
      ></path>
    </>
  );
};
