import activation from '@/assets/audio/activation.wav';
import { VideoSection } from '@/models/video-section';

const videoSections: Array<VideoSection> = [
    {
        id: 'section-1',
        iv: {start: 0, end: 2},
        audioItems: [
            {
                id: 'audio-1',
                src: activation,
                iv: { start: 0, end: 1 }
            },
            {
                id: 'audio-2',
                src: activation,
                iv: { start: 1, end: 2 }
            },
            
        
        ],
        labels: [

        ]
    },
    {
        id: 'section-2',
        iv: {start: 2, end: 4},
        audioItems: [
            {
                id: 'audio-3',
                src: activation,
                iv: { start: 2, end: 3 }
            },
            
        
        ],
        labels: [

        ]
    },
    {
        id: 'section-2',
        iv: {start: 4, end: 8},
        audioItems: [
            {
                id: 'audio-1',
                src: activation,
                iv: { start: 4, end: 7 }
            },
            {
                id: 'audio-2',
                src: activation,
                iv: { start: 7, end: 8 }
            },
            
        
        ],
        labels: [

        ]
    }
]


export { videoSections };
