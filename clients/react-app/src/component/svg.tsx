import { useMemo } from "react";

import { computeMarginForAspectRatio } from "@/models/margin";
import { scaleLinear } from "@visx/scale";
import { ComponentProps } from "react";
import { PropsWithoutChildren, SvgChildFn } from "./svg.types";

type SvgProps = PropsWithoutChildren<ComponentProps<"svg">> & {
  children: SvgChildFn;
  innerWidth: number;
  innerHeight: number;
  aspectRatio: [aw: number, ah: number];
};

const Svg = ({
  innerWidth,
  innerHeight,
  aspectRatio: [aw, ah],
  children,
}: SvgProps) => {
  const margin = useMemo(() => {
    return computeMarginForAspectRatio(innerWidth, innerHeight, aw, ah);
  }, [innerWidth, innerHeight, aw, ah]);

  const xScale = useMemo(
    () =>
      scaleLinear({
        range: [margin.left, innerWidth - margin.right],
        round: true,
        domain: [0, 1],
      }),
    [innerWidth, margin]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight - margin.top, margin.bottom],
        round: true,
        domain: [0, 1],
      }),
    [innerHeight, margin]
  );

  return (
    <svg
      width={innerWidth + margin.left + margin.right}
      height={innerHeight + margin.bottom + margin.top}
      fill="#044B94"
      fillOpacity="0.4"
      style={{
        resize: "both",
        overflow: "auto",
        position: "absolute",
        top: 0,
        left: 0,
        height: innerHeight + margin.bottom + margin.top,
        width: innerWidth + margin.left + margin.right,
      }}
    >
      {children({
        xScale,
        yScale,
      })}
    </svg>
  );
};

export { Svg };
