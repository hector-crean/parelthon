//https://codesandbox.io/p/sandbox/old-morning-pj3k7y?file=%2Fstore.js%3A25%2C2-29%2C5
import { AudioGraphEdge } from '@/models/audio-graph/edges';
import { AudioGraphNode, AudioNodeAttributes } from '@/models/audio-graph/nodes';
import { Connection, EdgeChange, OnConnect, OnEdgesChange, OnNodesChange, addEdge, applyEdgeChanges, applyNodeChanges, type NodeChange } from 'reactflow';
import { create } from 'zustand';
import {
    audioIsRunning,
    connect,
    updateAudioNode
} from './audio';


interface AudioStore {
    ctx: AudioContext,
    isRunning: boolean,
    nodes: AudioGraphNode[],
    edges: AudioGraphEdge[],
    toggleAudio: () => void;
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    updateNode(id: string, data: AudioNodeAttributes['data']): void
}

const useAudioStoreFactory = (ctx: AudioContext) => create<AudioStore>()(

    (set, get) => {

        return (
            {
                ctx,
                isRunning: ctx.state === 'running',
                nodes: [
                    { id: 'output-node', type: 'output-node', position: { x: 0, y: 0 }, data: {} },
                    { id: 'oscillator-node-1', type: 'oscillator-node', position: { x: 1, y: 0 }, data: new OscillatorNode(ctx) },
                    { id: 'gain-node-1', type: 'gain-node', position: { x: 3, y: 0 }, data: new GainNode(ctx) }


                ],
                edges: [],
                toggleAudio() {

                    async function toggle(): Promise<void> {
                        const ctx = get().ctx;
                        const isRunning = get().isRunning;

                        isRunning ? ctx.suspend() : ctx.resume()
                    }

                    toggle().then(() => {
                        set({ isRunning: audioIsRunning() });
                    });
                },
                onNodesChange(changes: NodeChange[]) {
                    set(({ nodes }) => ({ nodes: applyNodeChanges(changes, nodes) }));
                },
                onEdgesChange(changes: EdgeChange[]) {
                    set(({ edges }) => ({
                        edges: applyEdgeChanges(changes, edges),
                    }));
                },
                onConnect(connection: Connection) {
                    if (connection.source && connection.target) {
                        connect(connection.source, connection.target);
                        set(({ edges }) => ({ edges: addEdge(connection, edges) }));
                    }

                },
                updateNode(id: string, attributes: AudioNodeAttributes) {
                    updateAudioNode(id, attributes)
                    set(({ nodes }) => ({
                        nodes: nodes.map((node) =>
                            node.id === id ? { ...node, data: Object.assign(node, attributes.data) } : node
                        ),
                    }))
                },
            }
        )
    }
);



const useAudioStore = useAudioStoreFactory(new AudioContext())

export type { AudioStore };
export { useAudioStore };

