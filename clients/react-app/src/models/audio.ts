import { Interval } from "./interval";


interface Audio {
    id: string
    src: string;
    iv: Interval
}

export { audiosExample };
export type { Audio };


    import activation from '@/assets/audio/activation.wav';
    import hold_out from '@/assets/audio/sam-fender-hold-out.mp3';


const audiosExample = [
    {
        id: 'audio-1',
        src: activation,
        iv: { start: 0, end: 4 }
    },
    {
        id: 'audio-2',
        src: activation,
        iv: { start: 8, end: 13 }
    },
    {
        id: 'audio-3',
        src: hold_out,
        iv: { start: 11, end: 20 }
    },

]

