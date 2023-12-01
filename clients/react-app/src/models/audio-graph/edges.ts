import { Edge } from "reactflow";
import { Progress } from "../progress";


// Edge types
// type ProgressionEdge = GraphEdge<string, 'directed', 'progress-edge', Progress>

type ProgressionEdgeAttr = { type: 'progress-edge', data: Progress }

type AudioGraphEdgeAttributes = ProgressionEdgeAttr

type ExtractTypeAndData<T> = T extends { type: infer Type; data: infer Data } ? Type extends string ? Edge<Data> : never : never;

type AudioGraphEdge = ExtractTypeAndData<AudioGraphEdgeAttributes>

export type { AudioGraphEdge, AudioGraphEdgeAttributes };

