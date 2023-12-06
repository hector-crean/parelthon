import { AudioGraphEdgeADT } from "@/models/audio-graph/edges";
import { AudioNodeADT } from "@/models/audio-graph/nodes";
import { ComponentType, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  EdgeProps,
  NodeProps,
  ReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAudioStore } from "./audioStore";
import { ProgressEdgeView } from "./edges/progress-edge";
import { GainNode } from "./nodes/GainNode";
import { OscillatorNodeView } from "./nodes/OscillatorNode";
import { OutputNode } from "./nodes/OutNode";

type NodeLibrary = {
  [key in AudioNodeADT["type"]]?: ComponentType<NodeProps>;
};

type EdgeLibrary = {
  [key in AudioGraphEdgeADT["type"]]?: ComponentType<EdgeProps>;
};

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
};

interface AudioGraphProps {}

const AudioGraph = ({}: AudioGraphProps) => {
  const nodeTypes: NodeLibrary = useMemo(
    () => ({
      "oscillator-node": OscillatorNodeView,
      "output-node": OutputNode,
      "gain-node": GainNode,
    }),
    []
  );

  const edgeTypes: EdgeLibrary = useMemo(
    () => ({
      "progress-edge": ProgressEdgeView,
    }),
    []
  );

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useAudioStore();

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
