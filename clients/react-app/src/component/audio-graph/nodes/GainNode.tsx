import { ChangeEvent } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { AudioStore, useAudioStore } from "../audioStore";

const selector = (id: string) => (store: AudioStore) => ({
  setGain: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { gain: +e.target.value }),
});

interface Props extends NodeProps<GainNode> {
  id: string;
}

export function GainNode({ id, data }: Props) {
  const { setGain } = useAudioStore(selector(id));

  return (
    <div>
      <Handle type="target" position={Position.Top} />

      <p>Gain Node</p>
      <label>
        <p>Gain</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={data.gain.value}
          onChange={setGain}
        />
        <p>{data.gain.value.toFixed(2)}</p>
      </label>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
