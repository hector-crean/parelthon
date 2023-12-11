import { EditMode, EditState } from "@/models/canvas";
import RectangleButton from "./RectangleButton";
import SelectionButton from "./SelectionButton";
import styles from "./index.module.css";

type Props = {
  editState: EditState;
  setEditState: (newState: EditState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function ToolsBar({
  editState,
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
              editState.mode === EditMode.None ||
              editState.mode === EditMode.Translating ||
              editState.mode === EditMode.SelectionNet ||
              editState.mode === EditMode.Pressing ||
              editState.mode === EditMode.Resizing
            }
            onClick={() => setEditState({ mode: EditMode.None, kind: "edit" })}
          />
          {/* <PencilButton
            isActive={editState.mode === EditMode.Pencil}
            onClick={() =>
              setEditState({ mode: EditMode.Pencil, kind: "edit" })
            }
          /> */}
          <RectangleButton
            isActive={
              editState.mode === EditMode.Inserting &&
              editState.layerType === "Polygon"
            }
            onClick={() =>
              setEditState({
                kind: "edit",
                mode: EditMode.Inserting,
                layerType: "Polygon",
              })
            }
          />
          {/* <EllipseButton
            isActive={
              editState.mode === EditMode.Inserting &&
              editState.layerType === "Point"
            }
            onClick={() =>
              setEditState({
                kind: "edit",
                mode: EditMode.Inserting,
                layerType: "Point",
              })
            }
          /> */}
        </div>
        {/* <div className={styles.seperator}></div>
        <div className={styles.tools_panel_section}>
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div> */}
      </div>
    </div>
  );
}
