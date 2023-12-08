import { EditMode, EditState } from "@/models/canvas";
import EllipseButton from "./EllipseButton";
import PencilButton from "./PencilButton";
import RectangleButton from "./RectangleButton";
import RedoButton from "./RedoButton";
import SelectionButton from "./SelectionButton";
import UndoButton from "./UndoButton";
import styles from "./index.module.css";

type Props = {
  EditState: EditState;
  setEditState: (newState: EditState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function ToolsBar({
  EditState,
  setEditState,
  undo,
  redo,
  canUndo,
  canRedo,
}: Props) {
  return (
    <div className={styles.tools_panel_container}>
      <div className={styles.tools_panel}>
        <div className={styles.tools_panel_section}>
          <SelectionButton
            isActive={
              EditState.mode === EditMode.None ||
              EditState.mode === EditMode.Translating ||
              EditState.mode === EditMode.SelectionNet ||
              EditState.mode === EditMode.Pressing ||
              EditState.mode === EditMode.Resizing
            }
            onClick={() => setEditState({ mode: EditMode.None })}
          />
          <PencilButton
            isActive={EditState.mode === EditMode.Pencil}
            onClick={() => setEditState({ mode: EditMode.Pencil })}
          />
          <RectangleButton
            isActive={
              EditState.mode === EditMode.Inserting &&
              EditState.layerType === "Polygon"
            }
            onClick={() =>
              setEditState({
                mode: EditMode.Inserting,
                layerType: "Polygon",
              })
            }
          />
          <EllipseButton
            isActive={
              EditState.mode === EditMode.Inserting &&
              EditState.layerType === "Point"
            }
            onClick={() =>
              setEditState({
                mode: EditMode.Inserting,
                layerType: "Point",
              })
            }
          />
        </div>
        <div className={styles.seperator}></div>
        <div className={styles.tools_panel_section}>
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>
      </div>
    </div>
  );
}
