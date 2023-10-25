import { Label } from "@/models/label";
import { IntervalData } from "@/models/timespan";
import IntervalTree, { Interval } from "@flatten-js/interval-tree";
import { throttle } from "lodash";
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type VideoProps = React.ComponentPropsWithoutRef<"video"> & {
  intervalTree: IntervalTree<Label[]>;
  setActiveIntervalDatas: Dispatch<
    SetStateAction<IntervalData<Interval, Array<Label>>>
  >;
};

// Define the exposed methods on the ref
type VideoRef = {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
};

const Video = forwardRef<VideoRef, VideoProps>(
  ({ setActiveIntervalDatas, intervalTree, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Expose methods to the ref
    useImperativeHandle(ref, () => ({
      playVideo: handlePlayVideo,
      pauseVideo: handlePauseVideo,
      getCurrentTime: handleGetCurrentTime,
    }));

    // handlers :
    const handlePlayVideo = () => {
      videoRef.current?.play();
    };
    const handlePauseVideo = () => {
      videoRef.current?.pause();
    };

    const handleGetCurrentTime = () => {
      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

      const duration = videoRef.current?.duration;
      const currentTime = videoRef.current?.currentTime;

      return currentTime
        ? duration
          ? clamp(currentTime, 0, duration)
          : currentTime
        : 0;
    };

    const throttledHandleTimeUpdate = useCallback(
      throttle(
        (event: Event) => {
          if (event.target instanceof HTMLVideoElement && event.timeStamp) {
            const seconds = handleGetCurrentTime();

            const found = intervalTree.search(
              [seconds * 1000, seconds * 1000 + 1000],
              (data, interval) => {
                return { data, interval };
              }
            );

            setActiveIntervalDatas(found);
          }
        },
        1000 // invoking no more than once every 1000ms (1s)
      ),
      [intervalTree]
    );

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.addEventListener(
          "timeupdate",
          throttledHandleTimeUpdate
        );
        return () =>
          videoRef.current?.removeEventListener(
            "timeupdate",
            throttledHandleTimeUpdate
          );
      }
    }, [throttledHandleTimeUpdate]);

    return <video {...props} ref={videoRef}></video>;
  }
);

export { Video, type VideoRef };
