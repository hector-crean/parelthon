import { AudioGraph } from "@/models/audio-graph";

//mp3 files: 
import sampple_1 from "@/assets/mp3/sam-fender-hold-out.mp3";
import sampple_2 from "@/assets/mp3/sam-fender-not-the-only-one.mp3";


///

export const audiograph: AudioGraph = {
    data: {
        description: 'v0.1'
    },
    nodes: [
        {
            id: '1a40b2c8-07af-4a8b-a700-bbc9f48541c3',
            type: 'video-node',
            position: { x: 0, y: 0 },
            data: {
                aspectRatio: [4, 3],
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                audioUrl: sampple_1,
                labelIntervalDatas: [
                    {
                        period: [1000, 7000],
                        data: [
                            {
                                tag: "text_label",
                                text: "label 1.1",
                                height: 0.2,
                                width: 0.2,
                                top: 0.4,
                                left: 0.3,
                            },
                            {
                                tag: "text_label",
                                text: "label 1.2",
                                height: 0.2,
                                width: 0.2,
                                top: 0.8,
                                left: 0.2,
                            }
                        ],
                    },
                    {
                        period: [3000, 10000],
                        data: [
                            {
                                tag: "text_label",
                                text: "label 2.1",
                                height: 0.4,
                                width: 0.2,
                                top: 0.1,
                                left: 0.8,
                            },
                            {
                                tag: "text_label",
                                text: "label 2.2",
                                height: 0.2,
                                width: 0.2,
                                top: 0.5,
                                left: 0.3,
                            },
                            {
                                tag: "text_label",
                                text: "label 2.3",
                                height: 0.2,
                                width: 0.2,
                                top: 0.9,
                                left: 0.5,
                            },

                        ],
                    },


                ]

            }

        },
        {
            id: '4e283ead-4914-4f0a-97f7-5c384ff2fe14',
            type: 'video-node',
            position: { x: 300, y: 300 },
            data: {
                aspectRatio: [4, 3],
                videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                audioUrl: sampple_2,
                labelIntervalDatas: []
            }
        },
    ],
    edges: [
        {
            id: 'a2cab687-55ba-44ff-ab43-d1b3feddb5fa',
            source: '1a40b2c8-07af-4a8b-a700-bbc9f48541c3',
            target: '4e283ead-4914-4f0a-97f7-5c384ff2fe14',
            directedness: 'directed',
            type: 'progress-edge',
            data: {
                progressionRatio: 0,
            }
        }
    ]
}