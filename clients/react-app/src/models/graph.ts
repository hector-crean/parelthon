/**
 * A graph consists of nodes and edges where edges connect exactly two nodes. A graph can be either directed, i.e., 
 * an edge has a source and a target node or undirected where there is no such distinction.

In a directed graph, each node u has outgoing and incoming neighbors. An outgoing neighbor of node u is any node v 
for which an edge (u, v) exists. An incoming neighbor of node u is any node v for which an edge (v, u) exists.

In an undirected graph there is no distinction between source and target node. A neighbor of node u is any node v 
for which either an edge (u, v) or (v, u) exists.
 */

import { XYPosition } from "reactflow";


type Hashable = string | number | symbol;
type NodeIdx<Ix extends Hashable> = Ix
type EdgeIdx<Ix extends Hashable> = Ix

type Directedness = 'directed' | 'undirected'

type GraphNode<Ix, NodeKind, NodeAttribute> = {
    id: Ix,
    type: NodeKind,
    position: XYPosition,
    data: NodeAttribute,
}

interface GraphEdge<Ix extends Hashable, Ty extends Directedness, EdgeKind, EdgeAttribute> {
    id: Ix,
    source: NodeIdx<Ix>,
    target: NodeIdx<Ix>,
    directedness: Ty,
    type: EdgeKind,
    data: EdgeAttribute,
}




export type { GraphEdge, GraphNode, Directedness, EdgeIdx, NodeIdx, Hashable };

//We'll use the above types to represent our graphs. We can then create converters to transform this data into an appropriate format for
//our choice of graph library







