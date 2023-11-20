"use-client";

import { Tabs, tabs } from "@/component/tabs/Tabs";
import { exitFullscreenIconPath } from "@/icons/ExitFullscreen";
import { fullscreenIconPath } from "@/icons/Fullscreen";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import styles from "./VideoLayout.module.css";

const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: ({ delay }: { delay: number }) => {
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 0.5, bounce: 0 },
        opacity: { delay, duration: 0.5 },
      },
    };
  },
};

interface EnterExitFullscreenIconProps {
  isOn: boolean;
}
export function EnterExitFullscreenIcon({
  isOn,
}: EnterExitFullscreenIconProps) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d={exitFullscreenIconPath}
        variants={drawPath}
        custom={{ delay: 0 }}
        animate={isOn ? "visible" : "hidden"}
        strokeWidth={"10px"}
        strokeLinecap={"round"}
        stroke={"transparent"}
        fill="white"
      />
      <motion.path
        d={fullscreenIconPath}
        variants={drawPath}
        custom={{ delay: 0 }}
        animate={!isOn ? "visible" : "hidden"}
        strokeWidth={"10px"}
        strokeLinecap={"round"}
        stroke={"transparent"}
        fill="black"
      />
    </motion.svg>
  );
}

const coverup = {
  closed: ({ delay }: { delay: number }) => {
    return {
      opacity: 0,
      width: "60px",
      height: "60px",
      transition: {
        opacity: { delay, duration: 0.5 },
        width: { delay, type: "spring", duration: 0.5, bounce: 0 },
        height: { delay, type: "spring", duration: 0.5, bounce: 0 },
      },
    };
  },
  open: ({ delay }: { delay: number }) => {
    return {
      opacity: 1,
      backgroundColor: "black",
      width: "100%",
      height: "100%",
      transition: {
        width: { delay, type: "spring", duration: 0.5, bounce: 0 },
        height: { delay, type: "spring", duration: 0.5, bounce: 0 },
        opacity: { delay, duration: 0.5 },
      },
    };
  },
};

const Coverup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={styles["modal_icon"]}
        onPointerDown={() => setIsOpen(!isOpen)}
      >
        {/* {isOpen ? <ExitFullscreenIcon /> : <FullscreenIcon />} */}
        <EnterExitFullscreenIcon isOn={isOpen} />
      </motion.div>
      <motion.div
        layout
        className={styles.modal}
        variants={coverup}
        custom={{ delay: 0 }}
        animate={isOpen ? "open" : "closed"}
        onPointerDown={() => setIsOpen(false)}
      >
        <motion.div layout className={styles.modal_content}>
          {/* <p> Modal content here</p> */}
        </motion.div>
      </motion.div>
    </>
  );
};

interface VideoLayoutProps {
  children: ReactNode;
}

const VideoLayout = ({ children }: VideoLayoutProps) => {
  return (
    <div className={styles.layout_grid_wrapper}>
      <div className={styles.layout_grid_inner}>
        <div className={clsx(styles.grid_item, styles.video_player_wrapper)}>
          {children}
          <Coverup />
        </div>

        <div className={clsx(styles.grid_item, styles.sidebar_wrapper)}>
          <Tabs initialTabs={tabs} />
        </div>

        <div className={clsx(styles.grid_item, styles.overview_wrapper)}>
          Bottom
        </div>
      </div>
    </div>
  );
};

export { VideoLayout };
