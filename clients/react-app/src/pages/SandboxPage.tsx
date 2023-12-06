import samFenderHoldOut from "@/assets/audio/sam-fender-hold-out.mp3";
import samFenderNotOnlyOne from "@/assets/audio/sam-fender-not-the-only-one.mp3";
import sample3s from "@/assets/audio/sample-3s.mp3";

import { Audio as AudioContext } from "@/component/Audio";
import { AudioTimeBar } from "@/component/AudioTimeBar";
import { AudioTrack } from "@/component/AudioTrack";
import { useAudioNode } from "@/hooks/nodes";
import { Audio } from "@/models/audio";
import {
  ReactNode,
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import * as sac from "standardized-audio-context";

export { SandboxPage };

interface StageContext {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isSeeking: boolean;
  setIsSeeking: (isSeeking: boolean) => void;
}
export const StageContext = createContext<StageContext>({
  time: 0,
  setTime: (time: number) => {},
  duration: 0,
  setDuration: (duration: number) => {},
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => {},
  isSeeking: false,
  setIsSeeking: (isSeeking: boolean) => {},
});

interface StageProviderProps {
  children: ReactNode;
}
export const StageProvider = ({ children }: StageProviderProps) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  return (
    <StageContext.Provider
      value={{
        time,
        setTime,
        duration,
        setDuration,
        isPlaying,
        setIsPlaying,
        isSeeking,
        setIsSeeking,
      }}
    >
      {children}
    </StageContext.Provider>
  );
};

export const useStageContext = () => {
  const context = useContext(StageContext);

  if (!context) {
    throw new Error("useStageContext must be used inside the StageProvider");
  }

  return context;
};

type Interval = {
  start: number;
  end: number;
};

interface AudioTrackProps {
  audioFilePath: string;
  iv: Interval;
  time: number;
}

const AudioTrackV2 = ({ audioFilePath }: AudioTrackProps) => {
  const bufferSourceRef =
    useRef<sac.IAudioBufferSourceNode<sac.AudioContext>>();

  const gainNode = useAudioNode("id", (context) => context.createGain());

  const linkBufferSource = useCallback(
    (bufferSource: sac.IAudioBufferSourceNode<sac.AudioContext>) => {
      // cleanup previous
      bufferSourceRef.current?.disconnect();
      bufferSourceRef.current = bufferSource;
      // start new
      bufferSourceRef.current.connect(gainNode);
    },
    [gainNode]
  );

  const startHandler = useCallback(
    (when: number, offset: number) => {
      if (!bufferSourceRef.current) {
        return;
      }

      const bufferSource = gainNode.context.createBufferSource();
      bufferSource.buffer = bufferSourceRef.current.buffer;
      linkBufferSource(bufferSource);
      bufferSourceRef.current.start(when, offset); // Use seekTime here
    },
    [gainNode, linkBufferSource]
  );

  const stopHandler = useCallback(() => {
    bufferSourceRef.current?.stop();
  }, []);

  const handleNewFileFn = async (file: File) => {
    const bufferSource = gainNode.context.createBufferSource();
    bufferSource.buffer = await gainNode.context.decodeAudioData(
      await file.arrayBuffer()
    );

    linkBufferSource(bufferSource);
  };

  const handleNewFile = useCallback(handleNewFileFn, [
    gainNode,
    linkBufferSource,
  ]);

  useEffect(() => {
    const createFile = async (
      path: string,
      name: string,
      type: string
    ): Promise<File> => {
      try {
        const response = await fetch(path);

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error fetching file: ${response.statusText}`);
        }

        const data = await response.blob();
        const metadata = { type: type };
        return new File([data], name, metadata);
      } catch (error) {
        console.error("Error creating file:", error);
        throw error; // Or handle the error as needed
      }
    };

    const fetchAndProcessFile = async () => {
      if (audioFilePath) {
        try {
          const file = await createFile(
            audioFilePath,
            "audiofile",
            "audio/mpeg"
          );
          await handleNewFile(file);
        } catch (error) {
          console.error("Error processing file:", error);
        }
      }
    };

    fetchAndProcessFile().then(
      () => console.log("file fetched and processed"),
      () => console.log("file failed to load")
    );
  }, [handleNewFile, audioFilePath]);

  return null;
};

const PageContent = () => {
  const {
    time,
    setTime,
    duration,
    isPlaying,
    setIsPlaying,
    setDuration,
    setIsSeeking,
    isSeeking,
  } = useStageContext();

  const playerRef = useRef<ReactPlayer>(null);

  //handlers

  // On seek, update UI time
  const handleSliderChange = useCallback((value: number) => {
    setIsSeeking(true);
    setTime(value);
  }, []);

  // On end seeking, update UI time and update video time
  const handleSliderCommit = useCallback((value: number) => {
    setTime(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, "seconds");
    }
    setIsSeeking(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleProgress = useCallback(
    (progress: OnProgressProps) => {
      if (!isSeeking) {
        setTime(progress.played);
      }
    },
    [isSeeking]
  );

  const audioTracks: Array<Audio> = [
    { iv: { start: 0, end: 5 }, src: samFenderNotOnlyOne, id: "sam-fender-1" },
    { iv: { start: 4, end: 6.5 }, src: samFenderHoldOut, id: "sam-fender-2" },
    { iv: { start: 7, end: 9 }, src: sample3s, id: "other" },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={null}>
        <AudioTimeBar
          time={time}
          handleSliderChange={handleSliderChange}
          handleSliderCommit={handleSliderCommit}
          duration={duration}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        {/* <video
          style={{ width: "100%" }}
          ref={playerRef}
          src="https://pub-96d1d56fbc0e4812805ac1bc8104bd03.r2.dev/2023/09/Hero_Loop_A_HiRes.mp4"
          onPointerDown={togglePlayPause}
          onEnded={() => setIsPlaying(false)}
        /> */}
        <div
          onPointerDown={() => setIsPlaying(!isPlaying)}
          style={{ width: "100%" }}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="auto"
            playing={isPlaying}
            onDuration={setDuration}
            onProgress={handleProgress}
            progressInterval={200}
            onEnded={handleEnded}
            url="https://pub-96d1d56fbc0e4812805ac1bc8104bd03.r2.dev/2023/09/Hero_Loop_A_HiRes.mp4"
          />
        </div>

        {audioTracks.map((track, i) => (
          <AudioTrack
            isSeeking={isSeeking}
            key={`${track.id}-${i}-${track.src}`}
            time={time}
            track={track}
            isPlaying={isPlaying}
            muted={false}
          />
        ))}
      </Suspense>
    </div>
  );
};

const SandboxPage = () => {
  return (
    <section>
      <AudioContext>
        <StageProvider>
          <PageContent />
        </StageProvider>
      </AudioContext>
    </section>
  );
};
