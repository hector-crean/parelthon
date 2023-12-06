import { AudioNodeADT } from '@/models/audio-graph/nodes';
import { DirectedGraph } from "graphology";



const audioCtx = new AudioContext();


export const runtimeDag = new DirectedGraph();

audioCtx.suspend();

runtimeDag.addNode('output', audioCtx.destination);


export function audioIsRunning() {
    return audioCtx.state === 'running';
}

export function toggleAudio() {
    return audioIsRunning() ? audioCtx.suspend() : audioCtx.resume();
}



export const addAudioNode = (id: string, audioNodeADT: AudioNodeADT) => {
    const node = createAudioNode(audioCtx, audioNodeADT)
    runtimeDag.addNode(id, node)
}

export const updateAudioNode = (id: string, params: AudioNodeADT['params']) => {

    const node = runtimeDag.findNode((nodeId) => nodeId == id);
    runtimeDag.updateNodeAttributes(node, attrs => {
        return ({ ...attrs, params })
    })
}

export const removeAudioNode = (id: string) => {

    const node = runtimeDag.getNodeAttributes(id);
    node.disconnect();

    runtimeDag.dropNode(id);
}

export const disconnect = (sourceId: string, targetId: string) => {


    const sourceNode = runtimeDag.getNodeAttributes(sourceId);
    const targetNode = runtimeDag.getNodeAttributes(targetId);
    sourceNode.disconnect(targetNode)


}

export const connect = (sourceId: string, targetId: string) => {


    const sourceNode = runtimeDag.getNodeAttributes(sourceId);
    const targetNode = runtimeDag.getNodeAttributes(targetId);

    //disconnect in dag

    //disconnect in web audio graph
    sourceNode.connect(targetNode)


}




//// util functions

const createAudioNode = (ctx: AudioContext, adt: AudioNodeADT): AudioNode => {
    switch (adt.type) {
        case 'oscillator-node':
            return new OscillatorNode(ctx, adt.params);
        case 'analyser-node':
            return new AnalyserNode(ctx, adt.params);
        case 'audio-buffer-source-node':
            return new AudioBufferSourceNode(ctx, adt.params);
        case 'gain-node':
            return new GainNode(ctx, adt.params);
        // case 'iir-filter-node':
        //     return new IIRFilterNode(ctx, adt.params);
        // case 'media-element-source-node':
        //     return new MediaElementAudioSourceNode(ctx, adt.params);
        // case 'media-stream-source':
        //     return new MediaStreamAudioSourceNode(ctx, adt.params);
        // case 'biquad-filter-node':
        //     return new BiquadFilterNode(ctx, adt.params);
        // case 'channel-merge-node':
        //     return new ChannelMergerNode(ctx, adt.params);
        // case 'channel-splitter-node':
        //     return new ChannelSplitterNode(ctx, adt.params);
        // case 'constance-source-node':
        //     return new ConstantSourceNode(ctx, adt.params);
        // case 'convolver-node':
        //     return new ConvolverNode(ctx, adt.params);
        // case 'delay-node':
        //     return new DelayNode(ctx, adt.params);
        // case 'dynamic-compressor-node':
        //     return new DynamicsCompressorNode(ctx, adt.params);

        // case 'panner-node':
        //     return new PannerNode(ctx, adt.params);
        // case 'stereo-panner-node':
        //     return new StereoPannerNode(ctx, adt.params);
        // case 'wave-shaper-node':
        //     return new WaveShaperNode(ctx, adt.params)
        default:
            return new OscillatorNode(ctx, {});

    }
}


// function initAudioGraph(
//     ctx: AudioContext,
//     nodes:
// ) {
//     const runtimeDag = new DirectedGraph<ReturnType<typeof createAudioNode>>();

//     dag.forEachNode((nodeId, attributes) => {
//         const audioNode = createAudioNode(ctx, attributes);
//         runtimeDag.addNode(nodeId, audioNode);
//     });

//     dag.forEachEdge((edgeId, source, target) => {
//         runtimeDag.addEdgeWithKey(edgeId, source, target);
//     });

//     runtimeDag.forEachNode((sourceId) => {
//         const sourceAudioNode = runtimeDag.getNodeAttributes(sourceId);
//         runtimeDag.outNeighbors(sourceId).forEach(targetId => {
//             const targetAudioNode = runtimeDag.getNodeAttributes(targetId);
//             sourceAudioNode.connect(targetAudioNode);
//         });
//     });

//     return runtimeDag
// }









