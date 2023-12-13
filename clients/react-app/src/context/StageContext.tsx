import { ReactNode, createContext, useContext, useState } from "react";

interface IStageContext {
  time: number;
  setTime: (time: number) => void;
  lastRequestedTime: number;
  setLastRequestedTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isSeeking: boolean;
  setIsSeeking: (isSeeking: boolean) => void;
  aspectRatio: [number, number];
  setAspectRatio: (aspectRatio: [number, number]) => void;
}
export const StageContext = createContext<IStageContext>({
  time: 0,
  setTime: (time: number) => {},
  lastRequestedTime: 0,
  setLastRequestedTime: (time: number) => {},
  duration: 0,
  setDuration: (duration: number) => {},
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => {},
  isSeeking: false,
  setIsSeeking: (isSeeking: boolean) => {},
  aspectRatio: [16, 9],
  setAspectRatio: (aspectRatio: [number, number]) => {},
});

interface StageProviderProps {
  children: ReactNode;
}
export const StageProvider = ({ children }: StageProviderProps) => {
  const [time, setTime] = useState(0);
  const [lastRequestedTime, setLastRequestedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<[number, number]>([16, 9]);

  return (
    <StageContext.Provider
      value={{
        time,
        setTime,
        lastRequestedTime,
        setLastRequestedTime,
        duration,
        setDuration,
        isPlaying,
        setIsPlaying,
        isSeeking,
        setIsSeeking,
        aspectRatio,
        setAspectRatio,
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
