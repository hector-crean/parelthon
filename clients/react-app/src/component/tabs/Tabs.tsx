import { CrossIcon } from "@/icons/CrossIcon";
import { PauseIcon } from "@/icons/Pause";
import { PlayIcon } from "@/icons/Play";
import { PlusIcon } from "@/icons/PlusIcon";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { ReactNode, useState } from "react";
import styles from "./tabs.module.css";

export const tabs = [
  {
    id: "tab-1",
    label: "Tab 1",
    icon: <PlayIcon />,
  },
  {
    id: "tab-2",
    label: "Tab 2",
    icon: <PauseIcon />,
  },
] satisfies Array<Tabable>;

///

interface Tabable {
  id: string;
  label: string;
  icon: ReactNode;
}
interface Props<T extends Tabable> {
  item: T;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}

function Tab<T extends Tabable>({
  item,
  onClick,
  onRemove,
  isSelected,
}: Props<T>) {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        backgroundColor: isSelected ? "#f3f3f3" : "inherit",
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: "grey" }}
      className={isSelected ? styles["selected"] : ""}
      onPointerDown={onClick}
    >
      <motion.span layout="position">
        {item.icon}
        {` ${item.label}`}
      </motion.span>
      <motion.div layout className={styles["close"]}>
        <motion.button
          className={styles["button"]}
          onPointerDown={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          initial={false}
          animate={{ backgroundColor: isSelected ? "#e3e3e3" : "inherit" }}
        >
          <CrossIcon />
        </motion.button>
      </motion.div>
    </Reorder.Item>
  );
}

interface TabsProps<T extends Tabable> {
  initialTabs: Array<T>;
}
export function Tabs<T extends Tabable>({ initialTabs }: TabsProps<T>) {
  const [tabs, setTabs] = useState<Array<T>>(initialTabs);
  const [selectedTab, setSelectedTab] = useState<T>(initialTabs[0]);

  const removeTabHandler = (tab: T) => {
    if (tab === selectedTab) {
      setSelectedTab(closestItem(tabs, tab));
    }
    setTabs(removeItem(tabs, tab));
  };
  const addTabHandler = () => {};

  return (
    <div className={styles["tabs_container"]}>
      <nav>
        <Reorder.Group
          as="ul"
          axis="x"
          onReorder={setTabs}
          className={styles["tabs"]}
          values={tabs}
        >
          <AnimatePresence initial={false}>
            {tabs.map((item) => (
              <Tab
                key={item.label}
                item={item}
                isSelected={selectedTab === item}
                onClick={() => setSelectedTab(item)}
                onRemove={() => removeTabHandler(item)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <motion.button
          className={styles["add-item"]}
          onClick={addTabHandler}
          disabled={tabs.length === initialTabs.length}
          whileTap={{ scale: 0.9 }}
        >
          <PlusIcon />
        </motion.button>
      </nav>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            {selectedTab ? selectedTab.icon : "😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// utils

export function removeItem<T>([...arr]: T[], item: T) {
  const index = arr.indexOf(item);
  index > -1 && arr.splice(index, 1);
  return arr;
}

export function closestItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item);
  if (index === -1) {
    return arr[0];
  } else if (index === arr.length - 1) {
    return arr[arr.length - 2];
  } else {
    return arr[index + 1];
  }
}
