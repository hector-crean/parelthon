/**
 * State:
 * - Chapter
 *      - timestamp
 *      - active label
 *      - 
 */



import { create } from 'zustand';


type VideoMode = 'loading' | 'idle' | 'buffering' | 'playing' | 'paused' | 'ended'


interface VideoStage {
    // mode: VideoMode,
    // Other actors can set the time, but the video component itself must then sync its time
    // with this. Actos do not have a handle directly to the video component itself
    // setMode: (mode: VideoMode) => void;
    time: number;
    setTime: (time: number) => void;
    // The video component subscribes to the timeIsSynced variable, and updates its internal time
    // to correlate with the `time` variable
    timeIsSynced: boolean,
    setTimeIsSynced: (synced: boolean) => void
    // components can subscribe to the seeking, and update their time when the seeking is finished
    isSeeking: boolean;
    setIsSeeking: (isSeeking: boolean) => void;

    duration: number;
    setDuration: (duration: number) => void;
    aspectRatio: [number, number];
    setAspectRatio: (aspectRatio: [number, number]) => void;

    isPlaying: boolean
    setIsPlaying: (isPlaying: boolean) => void;

    togglePlayPause: () => void;
}




const useVideoStageStore = create<VideoStage>(


    (set, get) => ({

        time: 0,
        setTime: (time) => set({ time: time }),
        timeIsSynced: true,
        setTimeIsSynced: (synced) => set({ timeIsSynced: synced }),
        isSeeking: false,
        setIsSeeking: (isSeeking) => set({ isSeeking: isSeeking }),
        //set a reasonable, nonzero time
        duration: 60,
        setDuration: (duration) => set({ duration: duration }),
        aspectRatio: [16, 9],
        setAspectRatio: (ar) => set({ aspectRatio: ar }),
        isPlaying: true,
        setIsPlaying: (isPlaying: boolean) => set({ isPlaying: isPlaying }),
        togglePlayPause: () => set(({ isPlaying }) => ({ isPlaying: !isPlaying }))
    }),

)





export { useVideoStageStore };

