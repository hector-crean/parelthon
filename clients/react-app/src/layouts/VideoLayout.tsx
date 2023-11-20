"use-client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import styles from "./VideoLayout.module.css";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      data-isOpen={isOpen}
      className={styles.modal}
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.div layout className={styles.modal_content} />
    </motion.div>
  );
};

interface VideoLayoutProps {
    children: ReactNode
}

const VideoLayout = ({children}: VideoLayoutProps) => {
  return (
    <div className={styles.layout_grid_wrapper}>
      <div className={styles.layout_grid_inner}>
        <div className={clsx(styles.grid_item, styles.video_player_wrapper)}>
          {children}
          <Modal />
        </div>

        <div className={clsx(styles.grid_item, styles.sidebar_wrapper)}>
          Sidebar
        </div>

        <div className={clsx(styles.grid_item, styles.overview_wrapper)}>
          Bottom
        </div>
      </div>
    </div>
  );
};

export { VideoLayout };
