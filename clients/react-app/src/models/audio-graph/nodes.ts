// import type { GraphNode } from "@/models/graph";
import { type Node } from 'reactflow'

export type AnalyserNodeAttributes = { type: 'analyser-node', data: AnalyserOptions }
export type AudioBufferSourceNodeAttributes = { type: 'audio-buffer-source-node', data: AudioBufferSourceOptions }
export type BiquadFilterNodeAttributes = { type: 'biquad-filter-node', data: BiquadFilterOptions }
export type ChannelMergeNodeAttributes = { type: 'channel-merge-node', data: ChannelMergerOptions }
export type ChannelSplitterNodeAttributes = { type: 'channel-splitter-node', data: ChannelSplitterOptions }
export type ContanceSourceNodeAttributes = { type: 'constance-source-node', data: ConstantSourceOptions }
export type ConvolverNodeAttributes = { type: 'convolver-node', data: ConvolverOptions }
export type DelayNodeAttributes = { type: 'delay-node', data: DelayOptions }
export type DynamicCompressorNodeAttributes = { type: 'dynamic-compressor-node', data: DynamicsCompressorOptions }
export type GainNodeAttributes = { type: 'gain-node', data: GainOptions }
export type IifFilterNodeAttributes = { type: 'iir-filter-node', data: IIRFilterOptions }
export type MediaElementSourceNodeAttributes = { type: 'media-element-source-node', data: MediaElementAudioSourceOptions }
export type MediaStreamSourceNodeAttributes = { type: 'media-stream-source', data: MediaStreamAudioSourceOptions }
export type OscillatorNodeAttributes = { type: 'oscillator-node', data: OscillatorOptions }
export type PannerNodeAttributes = { type: 'panner-node', data: PannerOptions }
export type StereoPannerNodeAttributes = { type: 'stereo-panner-node', data: StereoPannerOptions }
export type WaveShaperNodeAttributes = { type: 'wave-shaper-node', data: WaveShaperOptions }
export type OuputNodeAttributes = { type: 'output', data: {} }

type AudioNodeAttributes =
    | AnalyserNodeAttributes
    | AudioBufferSourceNodeAttributes
    | BiquadFilterNodeAttributes
    | ChannelMergeNodeAttributes
    | ChannelSplitterNodeAttributes
    | ContanceSourceNodeAttributes
    | ConvolverNodeAttributes
    | DelayNodeAttributes
    | DynamicCompressorNodeAttributes
    | GainNodeAttributes
    | IifFilterNodeAttributes
    | MediaElementSourceNodeAttributes
    | MediaStreamSourceNodeAttributes
    | OscillatorNodeAttributes
    | PannerNodeAttributes
    | StereoPannerNodeAttributes
    | WaveShaperNodeAttributes
    | OuputNodeAttributes



type ExtractTypeAndData<T> = T extends { type: infer Type; data: infer Data } ? Type extends string ? Node<Data, Type> : never : never;


type AudioGraphNode = ExtractTypeAndData<AudioNodeAttributes>


export type { AudioGraphNode, AudioNodeAttributes }




