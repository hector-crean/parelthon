//This is a panel which shows when a layer is selected
interface SelectionTool {
  selectedLayerId: string;
  moveBack: () => void;
  moveForward: () => void;
  delete: () => void;
}

const SelectionTool = () => {
  return <div></div>;
};
