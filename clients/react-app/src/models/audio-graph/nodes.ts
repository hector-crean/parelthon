// import type { GraphNode } from "@/models/graph";


export type GainNodeAttributes = { type: 'gain-node', params: GainOptions, }
export type AnalyserNodeAttributes = { type: 'analyser-node', params: AnalyserOptions, }
export type AudioBufferSourceNodeAttributes = { type: 'audio-buffer-source-node', params: AudioBufferSourceOptions, }
export type OscillatorNodeAttributes = { type: 'oscillator-node', params: OscillatorOptions, }


// export type BiquadFilterNodeAttributes = { type: 'biquad-filter-node', params: BiquadFilterOptions, instance: BiquadFilterNode }
// export type ChannelMergeNodeAttributes = { type: 'channel-merge-node', params: ChannelMergerOptions, instance: ChannelMergerNode }
// export type ChannelSplitterNodeAttributes = { type: 'channel-splitter-node', params: ChannelSplitterOptions, instance: ChannelSplitterNode }
// export type ContanceSourceNodeAttributes = { type: 'constance-source-node', params: ConstantSourceOptions, instance:  }
// export type ConvolverNodeAttributes = { type: 'convolver-node', params: ConvolverOptions }
// export type DelayNodeAttributes = { type: 'delay-node', params: DelayOptions }
// export type DynamicCompressorNodeAttributes = { type: 'dynamic-compressor-node', params: DynamicsCompressorOptions }
// export type IifFilterNodeAttributes = { type: 'iir-filter-node', params: IIRFilterOptions }
// export type MediaElementSourceNodeAttributes = { type: 'media-element-source-node', params: MediaElementAudioSourceOptions }
// export type MediaStreamSourceNodeAttributes = { type: 'media-stream-source', params: MediaStreamAudioSourceOptions }
// export type PannerNodeAttributes = { type: 'panner-node', params: PannerOptions }
// export type StereoPannerNodeAttributes = { type: 'stereo-panner-node', params: StereoPannerOptions }
// export type WaveShaperNodeAttributes = { type: 'wave-shaper-node', params: WaveShaperOptions }
// export type OuputNodeAttributes = { type: 'output-node', params: AudioBufferSourceOptions }

type AudioNodeADT =
    | AnalyserNodeAttributes
    | AudioBufferSourceNodeAttributes
    | GainNodeAttributes
    | OscillatorNodeAttributes
// | BiquadFilterNodeAttributes
// | ChannelMergeNodeAttributes
// | ChannelSplitterNodeAttributes
// | ContanceSourceNodeAttributes
// | ConvolverNodeAttributes
// | DelayNodeAttributes
// | DynamicCompressorNodeAttributes
// | IifFilterNodeAttributes
// | MediaElementSourceNodeAttributes
// | MediaStreamSourceNodeAttributes
// | PannerNodeAttributes
// | StereoPannerNodeAttributes
// | WaveShaperNodeAttributes
// | OuputNodeAttributes


type AudioNodeParams = AudioNodeADT['params']
type AudioNodeInstance = AudioNodeADT['instance']


export type { AudioNodeParams, AudioNodeADT, AudioNodeInstance }




