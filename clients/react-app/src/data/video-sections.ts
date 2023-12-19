import { VideoSection } from '@/models/video-section';

import audio1 from '@/assets/audio/reg/1.wav';
import audio2 from '@/assets/audio/reg/2.wav';
import audio3 from '@/assets/audio/reg/3.wav';
import audio4 from '@/assets/audio/reg/4.wav';
import audio5 from '@/assets/audio/reg/5.wav';
import audio6 from '@/assets/audio/reg/6.wav';
import audio7 from '@/assets/audio/reg/7.wav';
import audio8 from '@/assets/audio/reg/8.wav';

const videoSections: Array<VideoSection> = [
    {
        id: 'section-1',
        iv: { start: 0, end: 96 },
        audioItems: [
            {
                id: 'section-1:audio-1',
                //27s
                src: audio1,
                iv: { start: 0, end: 27 }
            },
            {
                id: 'section-1:audio-2',
                //29s
                src: audio2,
                iv: { start: 27, end: 56 }
            },
            {
                id: 'section-1:audio-2',
                //40s
                src: audio3,
                iv: { start: 56, end: 96 }
            },


        ],
        labels: [

        ]
    },
    {
        id: 'section-2',
        iv: { start: 96, end: 90 },
        audioItems: [
            {
                id: 'section-2:audio-1',
                //27s
                src: audio4,
                iv: { start: 96, end: 123 }
            },
            {
                id: 'section-2:audio-1',
                //21s
                src: audio5,
                iv: { start: 123, end: 144 }
            },


        ],
        labels: [

        ]
    },
    {
        id: 'section-3',
        iv: { start: 144, end: 225 },
        audioItems: [
            {
                id: 'section-3:audio-1',
                src: audio6,
                //26s
                iv: { start: 144, end: 170 }
            },
            {
                //36s
                id: 'section-3:audio-2',
                src: audio7,
                iv: { start: 170, end: 206 }
            },
            {
                id: 'section-3:audio-3',
                // 19s
                src: audio8,
                iv: { start: 206, end: 225 }
            },


        ],
        labels: [

        ]
    }
]


export { videoSections };

