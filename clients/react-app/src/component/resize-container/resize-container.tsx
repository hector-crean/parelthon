import { throttle } from "lodash";
import {
  ComponentPropsWithoutRef,
  ElementType,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./resize-container.module.css";
import type {
  ChildFn,
  PropsWithoutChildren,
  Rect,
} from "./resize-container.types";

type ResizeContainerProps<T extends ElementType> = PropsWithoutChildren<
  ComponentPropsWithoutRef<T>
> & {
  as: T;
  children: ChildFn;
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
      }, 100), // Throttling to at most once every 100 milliseconds
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

export { ResizeContainer };
