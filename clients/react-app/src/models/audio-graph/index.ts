import type { AudioGraphEdge } from './edges';
import type { AudioGraphNode } from './nodes';

//This is a fairly concrete implementation of a graph. 

// GraphAttribute: a description of the graph.
type GraphDescription = {
    description: string;
};


interface AudioGraph {
    data: GraphDescription,
    nodes: AudioGraphNode[],
    edges: AudioGraphEdge[],
}


export type { AudioGraph };

