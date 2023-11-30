//https://codesandbox.io/p/sandbox/old-morning-pj3k7y?file=%2Fstore.js%3A25%2C2-29%2C5
import { AudioGraphEdge } from '@/models/audio-graph/edges';
import { AudioGraphNode, AudioNodeAttributes } from '@/models/audio-graph/nodes';
import { nanoid } from 'nanoid';
import { applyNodeChanges, type NodeChange } from 'reactflow';
import { create } from 'zustand';
import {
    addAudioNode,
    audioIsRunning,
    toggleAudio
} from './audio';


interface AudioStore {
    nodes: AudioGraphNode[],
    edges: AudioGraphEdge[],
    isRunning: boolean,
    toggleAudio: () => void;
}

export const useAudioStore = create<AudioStore>()((set, get) => ({
    nodes: [
        { id: 'output', type: 'output', position: { x: 0, y: 0 }, data: {} }
    ],
    edges: [],
    isRunning: audioIsRunning(),
    toggleAudio() {
        toggleAudio().then(() => {
            set({ isRunning: audioIsRunning() });
        });
    },
    onNodesChange(changes: NodeChange[]) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    addAudioNode(type: AudioNodeAttributes['type'], x: number, y: number) {
        const id = nanoid();

        switch (type) {
            case 'oscillator-node': {
                const position = { x: 0, y: 0 };

                const data = { frequency: 440, type: 'sine' };

                addAudioNode(id, { type: type, data });
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }


        }
    }
}))  