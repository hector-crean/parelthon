import { ScaleLinear } from 'd3-scale';
import { ReactNode } from "react";
type PropsWithoutChildren<P> = P extends any
  ? "children" extends keyof P
  ? Omit<P, "children">
  : P
  : P;

type SvgChildFn = (
  args: {
    xScale: ScaleLinear<number, number, never>
    yScale: ScaleLinear<number, number, never>

  }
) => ReactNode;


export type { SvgChildFn, PropsWithoutChildren };

