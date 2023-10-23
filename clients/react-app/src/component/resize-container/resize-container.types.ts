import { ReactNode } from "react";

type PropsWithoutChildren<P> = P extends any
  ? "children" extends keyof P
    ? Omit<P, "children">
    : P
  : P;

type ChildFn = (
    args: {
      ref: HTMLElement | null;
      resize: (state: DOMRectReadOnly) => void;
    } & Rect
  ) => ReactNode;
  
  interface Rect {
    width: number;
    height: number;
    top: number;
    left: number;
  }

  export type { Rect, ChildFn, PropsWithoutChildren };

