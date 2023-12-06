import { ChangeEvent } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { AudioStore, useAudioStore } from "../audioStore";

interface Props extends NodeProps<OscillatorNode> {
  id: string;
  isConnectable: boolean;
}

const selector = (id: string) => (store: AudioStore) => ({
  setFrequency: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { frequency: +e.target.value }),
  setType: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { type: e.target.value }),
});

const OscillatorNodeView = ({ id, data, isConnectable }: Props) => {
  const { setFrequency, setType } = useAudioStore(selector(id));

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

      <label>
        <p>Frequency</p>
        <input
          className="nodrag"
          type="range"
          min="10"
          max="1000"
          value={data.frequency.value}
          onChange={setFrequency}
        />
        <p>{data.frequency.value} Hz</p>
      </label>
    </div>
  );
};

export { OscillatorNodeView };
