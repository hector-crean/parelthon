import { Interval } from "./interval";


interface Audio {
    id: string
    src: string;
    iv: Interval
}

export type { Audio };
export { audiosExample };


import activation from '@/assets/audio/activation.wav';
import hold_out from '@/assets/audio/sam-fender-hold-out.mp3';


const audiosExample = [
    {
        id: 'audio-1',
        src: activation,
        iv: { start: 0, end: 5 }
    },
    {
        id: 'audio-2',
        src: activation,
        iv: { start: 5, end: 7 }
    },
    {
        id: 'audio-3',
        src: hold_out,
        iv: { start: 6, end: 10 }
    },

]

