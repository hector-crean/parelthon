import { Audio } from "@/models/audio";
import { Slider, rem } from "@mantine/core";
import styles from './AudioTimeBar.module.css';
import { AudioTrack } from "./AudioTrack";


interface Props {
  duration: number;
  time: number;
  handleSliderChange: (time: number) => void;
  handleSliderCommit: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isSeeking: boolean
  audioTracks: Array<Audio>
}

const AudioTimeBar = (props: Props) => {



  const {
    isPlaying,
    duration,
    time,
    handleSliderChange,
    handleSliderCommit,
    setIsPlaying,
    audioTracks,
    isSeeking
  } = props;



  // const draw = useCallback(() => {}, []);

  // const tick = useCallback(() => {
  //   if (isPlaying) {
  //     handleTimeUpdate();
  //     draw();
  //   }
  // }, [draw, isPlaying]);

  // useAnimationFrame(tick);

  return (
    <div className={styles.container}>
      {audioTracks.map((track, i) => (
        <AudioTrack
          isSeeking={isSeeking}
          key={`${track.id}-${i}-${track.src}`}
          videoTime={time}
          videoDuration={duration}
          track={track}
          isPlaying={isPlaying}
          muted={false}
        />
      ))}
      <Slider
        styles={(theme) => ({
          root: {
            width: "100%",
            position: 'absolute',
            bottom: '50%',
            transform: 'translate(0, 50%)',
            left: 0,
            right: 0,
            pointerEvents: "all",
          },

          track: {
            backgroundColor: theme.colors.dark[3],
            height: rem(2),
          },
          mark: {
            width: 6,
            height: 6,
            borderRadius: 6,
            transform: 'translateX(-3px) translateY(-2px)',
            borderColor: theme.colors.dark[3],
          },
          markFilled: {
            borderColor: theme.colors.blue[6],
          },
          markLabel: { fontSize: theme.fontSizes.xs, marginBottom: 5, marginTop: 0 },
          thumb: {
            height: rem(2),
            width: rem(2),
            backgroundColor: theme.white,
            borderWidth: 1,
            boxShadow: theme.shadows.sm,
          },
        })}
        thumbSize={rem(25)}
        min={0}
        max={duration}
        value={time}
        // label={(v) => Math.round((v + Number.EPSILON) * 100) / 100}
        label={(v) => Math.round(v)}
        precision={2}
        step={0.1}
        onChange={handleSliderChange}
        onChangeEnd={handleSliderCommit}
      // marks={comments.map(c => ({ value: c.start_time, label: c.comment_id }))}
      // thumbChildren={
      //   isPlaying ? (
      //     <IconPlayerPause size={rem(1)} />
      //   ) : (
      //     <IconPlayerPlay size={rem(1)} />
      //   )
      // }
      />
    </div>

  );
};


export { AudioTimeBar };
