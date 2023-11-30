import { AudioGraphEdge } from "@/models/audio-graph/edges";
import { AudioGraphNode } from "@/models/audio-graph/nodes";
import { ComponentType, useCallback, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  EdgeProps,
  NodeProps,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  ReactFlowInstance,
  Edge as RfEdge,
  Node as RfNode,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { ProgressEdgeView } from "./edges/progress-edge";
import { OscillatorNodeView } from "./nodes/OscillatorNode";

type NodeLibrary = {
  [key in AudioGraphNode["type"]]?: ComponentType<NodeProps>;
};

type EdgeLibrary = {
  [key in AudioGraphEdge["type"]]?: ComponentType<EdgeProps>;
};

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
};

interface AudioGraphProps {
  initial_nodes: Array<RfNode>;
  initial_edges: Array<RfEdge>;
}

const AudioGraph = ({ initial_edges, initial_nodes }: AudioGraphProps) => {
  const nodeTypes: NodeLibrary = useMemo(
    () => ({
      "oscillator-node": OscillatorNodeView,
    }),
    []
  );

  const edgeTypes: EdgeLibrary = useMemo(
    () => ({
      "progress-edge": ProgressEdgeView,
    }),
    []
  );

  const [nodes, setNodes] = useState(initial_nodes);
  const [edges, setEdges] = useState(initial_edges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      proOptions={{ account: "paid-pro", hideAttribution: true }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onInit={onInit}
    >
      <Background
        color="#ccc"
        variant={BackgroundVariant.Cross}
        style={{ zIndex: -1 }}
      />
    </ReactFlow>
  );
};

export { AudioGraph };
