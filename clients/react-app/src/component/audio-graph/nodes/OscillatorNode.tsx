import { OscillatorNodeAttributes } from "@/models/audio-graph/nodes";
import { ChangeEvent } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import { useAudioStore } from "../audioStore";

interface Props extends NodeProps<OscillatorNodeAttributes["data"]> {
  id: string;
  isConnectable: boolean;
}

const selector = (id: string) => (store: typeof useAudioStore) => ({
  setFrequency: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { frequency: +e.target.value }),
  setType: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { type: e.target.value }),
});

const OscillatorNodeView = ({ id, data, isConnectable }: Props) => {
  const { setFrequency, setType } = useAudioStore(selector(id), shallow);

  return (
    <div style={{ width: `${100}px`, backgroundColor: "grey" }}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        onConnect={(params) => console.log("handle onConnect", params)}
      />

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        onConnect={(params) => console.log("handle onConnect", params)}
      />

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Frequency</p>
        <input
          className="nodrag"
          type="range"
          min="10"
          max="1000"
          value={data.frequency}
          onChange={setFrequency}
        />
        <p className={tw("text-right text-xs")}>{data.frequency} Hz</p>
      </label>
    </div>
  );
};

export { OscillatorNodeView };
