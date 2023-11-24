import { AspectRatio } from "@mantine/core";
import { throttle } from "lodash";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ResizeContainer.module.css";

type ResizeContainerProps<T extends ElementType> = PropsWithoutChildren<
  ComponentPropsWithoutRef<T>
> & {
  as: T;
  children: (
    args: {
      ref: HTMLElement | null;
      resize: (state: DOMRectReadOnly) => void;
    } & Rect
  ) => ReactNode;
};

const ResizeContainer = <T extends ElementType>({
  as,
  children,
  className,
  ...restProps
}: ResizeContainerProps<T>) => {
  const Element: ElementType = as;

  const containerRef = useRef<HTMLElement | null>(null);

  const animationFrameID = useRef(0);

  const [containerRect, setContainerRect] = useState<Rect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const throttledResize = useMemo(
    () =>
      throttle(({ width, height, top, left }: DOMRectReadOnly) => {
        setContainerRect({ width, height, top, left });
      }, 300), // Throttling to at most once every 100 milliseconds
    []
  );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        animationFrameID.current = window.requestAnimationFrame(() => {
          throttledResize(entry.contentRect);
        });
      });
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.cancelAnimationFrame(animationFrameID.current);
      observer.disconnect();
    };
  }, []);

  return (
    <Element
      ref={containerRef}
      className={`${styles.resize_container} ${className}`}
      {...restProps}
    >
      {children({
        ...containerRect,
        ref: containerRef.current,
        resize: throttledResize,
      })}
    </Element>
  );
};

interface MediaAsectRatioContainerProps {
  aspectRatio: [number, number];
  children: (args: { width: number; height: number }) => ReactNode;
}
const MediaAsectRatioContainer = ({
  aspectRatio: [aw, ah],
  children,
}: MediaAsectRatioContainerProps) => {
  return (
    <ResizeContainer
      as="div"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {({ width, height }) => (
        <AspectRatio
          maw={`${(width * aw) / ah}px`}
          mah={`${width / (aw / ah)}px`}
          w={"100%"}
        >
          <ResizeContainer as="div">
            {({ width: innerWidth, height: innerHeight }) =>
              children({ width: innerWidth, height: innerHeight })
            }
          </ResizeContainer>
        </AspectRatio>
      )}
    </ResizeContainer>
  );
};

// util types:
type PropsWithoutChildren<P> = P extends any
  ? "children" extends keyof P
    ? Omit<P, "children">
    : P
  : P;

interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export { ResizeContainer, MediaAsectRatioContainer };
