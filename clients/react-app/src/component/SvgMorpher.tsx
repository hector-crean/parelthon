"use client";
import { interpolate } from "flubber";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface SvgMorpherProps {
  paths: Array<string>;
}
function SVGMorpher({ paths }: SvgMorpherProps) {
  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);

  const arrayOfIndex = paths.map((_, i) => i);
  const path = useTransform(progress, arrayOfIndex, paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 1 }),
  });

  useEffect(() => {
    const animation = animate(progress, pathIndex, {
      duration: 0.4,
      ease: "easeInOut",
      delay: 0.5,
      onComplete: () => {
        if (pathIndex === paths.length - 1) {
          progress.set(0);
          setPathIndex(1);
        } else {
          setPathIndex(pathIndex + 1);
        }
      },
    });
    return () => {
      animation.stop();
    };
  }, [pathIndex]);

  return <motion.path fill="white" d={path} />;
}

export { SVGMorpher };
