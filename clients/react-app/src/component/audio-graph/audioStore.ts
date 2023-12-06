//https://codesandbox.io/p/sandbox/old-morning-pj3k7y?file=%2Fstore.js%3A25%2C2-29%2C5
import { AudioEdgeADT } from '@/models/audio-graph/edges';
import { AudioNodeADT } from '@/models/audio-graph/nodes';
import { Connection, Edge, EdgeChange, Node, OnConnect, OnEdgesChange, OnNodesChange, addEdge, applyEdgeChanges, applyNodeChanges, type NodeChange } from 'reactflow';
import { Entries } from 'type-fest';
import { create } from 'zustand';
import {
    audioIsRunning,
    connect
} from './audio';


interface AudioStore {
    ctx: AudioContext,
    isRunning: boolean,
    nodes: Node<AudioNodeADT['params']>[],
    edges: Edge<AudioEdgeADT['params']>[],
    nodeInstances: Map<string, AudioNodeADT['instance']>;
    toggleAudio: () => void;
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    updateAudioParam(id: string, data: AudioNodeADT['params']): void
}

const useAudioStoreFactory = (ctx: AudioContext) => create<AudioStore>()(

    (set, get) => {

        return (
            {
                ctx,
                isRunning: ctx.state === 'running',
                nodes: [
                    { id: 'output-node', type: 'output-node', position: { x: 0, y: 0 }, data: {} },
                    { id: 'oscillator-node-1', type: 'oscillator-node', position: { x: 1, y: 0 }, data: {} },
                    { id: 'gain-node-1', type: 'gain-node', position: { x: 3, y: 0 }, data: {} }


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
                //This is more with regards to position 
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
                updateAudioParam(id: string, data: AudioNodeADT['params']) {
                    const nodeInstance = get().nodeInstances.get(id);

                    if (nodeInstance) {
                        updateAudioNode(nodeInstance, data);
                        set({
                            nodes: get().nodes.map((node) =>
                                node.id === id ? { ...node, data: Object.assign(node.data, data) } : node
                            ),
                        });
                    }




                }
            }
        )
    }
);


export function updateAudioNode(nodeInstance: AudioNodeADT['instance'], data: AudioNodeADT['params']) {

    const entries = Object.entries(data) as Entries<typeof data>;

    for (const [key, val] of entries) {

        if (nodeInstance[key]) {
            node[key].value = val;
        } else {
            node[key] = val;
        }
    }
}



const useAudioStore = useAudioStoreFactory(new AudioContext())

export type { AudioStore };
export { useAudioStore };

