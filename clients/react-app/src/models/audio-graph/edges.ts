import { GraphEdge } from "../graph";
import { Progress } from "../progress";


// Edge types
type ProgressionEdge = GraphEdge<string, 'directed', 'progress-edge', Progress>

type AudioGraphEdge = ProgressionEdge

export type { AudioGraphEdge, ProgressionEdge };

