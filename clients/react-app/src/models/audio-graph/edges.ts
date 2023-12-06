import { Progress } from "../progress";


// Edge types
// type ProgressionEdge = GraphEdge<string, 'directed', 'progress-edge', Progress>

type ProgressionEdgeAttributes = { type: 'progress-edge', params: Progress }

type AudioEdgeADT = ProgressionEdgeAttributes

// type ExtractTypeAndData<T> = T extends { type: infer Type; data: infer Data } ? Type extends string ? Edge<Data> : never : never;

// type AudioGraphEdge = ExtractTypeAndData<AudioGraphEdgeAttributes>

export type { AudioEdgeADT };

