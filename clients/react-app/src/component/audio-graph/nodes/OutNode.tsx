import { Handle, NodeProps, Position } from "reactflow";
import { useAudioStore, type AudioStore } from "../audioStore";

const selector = (store: AudioStore) => ({
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
});

interface Props extends NodeProps<{}> {
  id: string;
}

export function OutputNode({ id, data }: Props) {
  const { isRunning, toggleAudio } = useAudioStore(selector);

  return (
    <div>
      <Handle type="target" position={Position.Top} />

      <button onClick={toggleAudio}>
        {isRunning ? (
          <span role="img" aria-label="mute">
            🔈
          </span>
        ) : (
          <span role="img" aria-label="unmute">
            🔇
          </span>
        )}
      </button>
    </div>
  );
}
