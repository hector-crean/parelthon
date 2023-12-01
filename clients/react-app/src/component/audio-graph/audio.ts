import { AudioNodeAttributes } from '@/models/audio-graph/nodes';
import { DirectedGraph } from "graphology";



const audioCtx = new AudioContext();

const serialisableDag: DirectedGraph<AudioNodeAttributes> = new DirectedGraph()

export const runtimeDag: DirectedGraph<AudioNode> = initAudioGraph(audioCtx, serialisableDag)

audioCtx.suspend();

runtimeDag.addNode('output', audioCtx.destination);


export function audioIsRunning() {
    return audioCtx.state === 'running';
}

export function toggleAudio() {
    return audioIsRunning() ? audioCtx.suspend() : audioCtx.resume();
}



export const addAudioNode = (/*ctx: AudioContext,*/ /*dag: DirectedGraph<AudioNode>,*/ id: string, attributes: AudioNodeAttributes) => {
    const node = createAudioNode(audioCtx, attributes)
    runtimeDag.addNode(id, node)
}

export const updateAudioNode = (/*ctx: AudioContext,*/ /*dag: DirectedGraph<AudioNode>,*/ id: string, attributes: AudioNodeAttributes['data']) => {

    const node = runtimeDag.findNode((nodeId) => nodeId == id);
    runtimeDag.updateNodeAttributes(node, attrs => {
        return ({ ...attrs, attributes })
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

    //disconnect in dag

    //disconnect in web audio graph
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

const createAudioNode = (ctx: AudioContext, attributes: AudioNodeAttributes): AudioNode => {
    switch (attributes.type) {
        case 'analyser-node':
            return new AnalyserNode(ctx, attributes.data);
        case 'audio-buffer-source-node':
            return new AudioBufferSourceNode(ctx, attributes.data);
        case 'biquad-filter-node':
            return new BiquadFilterNode(ctx, attributes.data);
        case 'channel-merge-node':
            return new ChannelMergerNode(ctx, attributes.data);
        case 'channel-splitter-node':
            return new ChannelSplitterNode(ctx, attributes.data);
        case 'constance-source-node':
            return new ConstantSourceNode(ctx, attributes.data);
        case 'convolver-node':
            return new ConvolverNode(ctx, attributes.data);
        case 'delay-node':
            return new DelayNode(ctx, attributes.data);
        case 'dynamic-compressor-node':
            return new DynamicsCompressorNode(ctx, attributes.data);
        case 'gain-node':
            return new GainNode(ctx, attributes.data);
        case 'iir-filter-node':
            return new IIRFilterNode(ctx, attributes.data);
        case 'media-element-source-node':
            return new MediaElementAudioSourceNode(ctx, attributes.data);
        case 'media-stream-source':
            return new MediaStreamAudioSourceNode(ctx, attributes.data);
        case 'oscillator-node':
            return new OscillatorNode(ctx, attributes.data);
        case 'panner-node':
            return new PannerNode(ctx, attributes.data);
        case 'stereo-panner-node':
            return new StereoPannerNode(ctx, attributes.data);
        case 'wave-shaper-node':
            return new WaveShaperNode(ctx, attributes.data)
        default:
            return new OscillatorNode(ctx, {});

    }
}


function initAudioGraph(
    ctx: AudioContext,
    dag: DirectedGraph<AudioNodeAttributes>
) {
    const runtimeDag = new DirectedGraph<ReturnType<typeof createAudioNode>>();

    dag.forEachNode((nodeId, attributes) => {
        const audioNode = createAudioNode(ctx, attributes);
        runtimeDag.addNode(nodeId, audioNode);
    });

    dag.forEachEdge((edgeId, source, target) => {
        runtimeDag.addEdgeWithKey(edgeId, source, target);
    });

    runtimeDag.forEachNode((sourceId) => {
        const sourceAudioNode = runtimeDag.getNodeAttributes(sourceId);
        runtimeDag.outNeighbors(sourceId).forEach(targetId => {
            const targetAudioNode = runtimeDag.getNodeAttributes(targetId);
            sourceAudioNode.connect(targetAudioNode);
        });
    });

    return runtimeDag
}









