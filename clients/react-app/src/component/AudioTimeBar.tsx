import { Slider, rem } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";

interface Props {
  duration: number;
  time: number;
  handleSliderChange: (time: number) => void;
  handleSliderCommit: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const renderAudioTimeBar = (props: Props) => {
  const {
    isPlaying,
    duration,
    time,
    handleSliderChange,
    handleSliderCommit,
    setIsPlaying,
  } = props;

  console.log(duration);

  // const draw = useCallback(() => {}, []);

  // const tick = useCallback(() => {
  //   if (isPlaying) {
  //     handleTimeUpdate();
  //     draw();
  //   }
  // }, [draw, isPlaying]);

  // useAnimationFrame(tick);

  return (
    <form style={{ width: "100%", height: "100px" }}>
      <Slider
        styles={{
          root: {
            position: "absolute",
            bottom: "20px",
            width: "100%",
            height: "max-content",
            pointerEvents: "all",
          },
          // label: {},
          thumb: {
            borderWidth: rem(2),
            padding: rem(3),
          },
          trackContainer: {
            backgroundColor: "transparent",
          },
          track: {
            backgroundColor: "transparent",
          },
          bar: {
            backgroundColor: "transparent",
          },

          // markWrapper: {},
          // mark: {},
          // markLabel: {}
        }}
        thumbSize={rem(25)}
        min={0}
        max={duration}
        value={time}
        precision={2}
        step={0.1}
        onChange={handleSliderChange}
        onChangeEnd={handleSliderCommit}
        // marks={comments.map(c => ({ value: c.start_time, label: c.comment_id }))}
        thumbChildren={
          isPlaying ? (
            <IconPlayerPause size={rem(1)} />
          ) : (
            <IconPlayerPlay size={rem(1)} />
          )
        }
      />
    </form>
  );
};

const AudioTimeBar = renderAudioTimeBar;

export { AudioTimeBar };
