import ribosome_path from "@/assets/images/ribosome.jpeg";
import { VideoComment } from "@/models/comment";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import styles from "./Label.module.css";

const labelVariant = {
  badge: {},
  compact: {},
  full: {},
};

export type Quadrant = `${"top" | "bottom"}-${"left" | "right"}`;
type Interval = { start: number; end: number };

interface LabelProps {
  comment: VideoComment;
  currentTime: number;
  arrowLayout?: Quadrant;
}

export const Label = ({ comment, currentTime, arrowLayout }: LabelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [{ start, end }, _] = useState<Interval>({
    start: comment.start_time,
    end: comment.end_time ? comment.end_time : comment.start_time + 2,
  });

  const active = useMemo(
    () =>
      start
        ? end
          ? currentTime >= start && currentTime < end
          : currentTime >= start
        : true,
    [currentTime, start, end]
  );

  // if (active) {
  //   store.addActiveCommentId(comment.comment_id);
  // } else {
  //   store.removeActiveCommentId(comment.comment_id);
  // }

  const quadrantFn = (x: number, y: number): Quadrant => {
    //top right
    if (x >= 0.5 * 100 && y >= 0.5 * 100) {
      return "top-right";
    }
    //top left
    if (x < 0.5 * 100 && y >= 0.5 * 100) {
      return "top-left";
    }
    //bottom right
    if (x >= 0.5 * 100 && y < 0.5 * 100) {
      return "bottom-right";
    }
    //top left
    if (x < 0.5 * 100 && y > 0.5 * 100) {
      return "top-left";
    }

    return "top-left";
  };

  const postionAlgFn = (quadrant: Quadrant): Quadrant => {
    switch (quadrant) {
      case "bottom-left":
        return "top-right";
      case "bottom-right":
        return "top-left";
      case "top-left":
        return "bottom-right";
      case "top-right":
        return "bottom-left";
    }
  };

  const [layout, setLayout] = useState<Quadrant>(
    arrowLayout
      ? arrowLayout
      : postionAlgFn(quadrantFn(comment.screen_x, comment.screen_y))
  );

  const [isActive, setIsActive] = useState(false);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          style={{
            left: `${comment.screen_x}%`,
            top: `${comment.screen_y}%`,
          }}
          className={styles.label_container}
          data-arrow-layout={layout}
          data-open={isOpen}
          onHoverStart={() => setIsOpen(true)}
          onHoverEnd={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className={styles.label_inner} data-arrow-layout={layout}>
            <motion.div
              className={styles.label_image_container}
              layout
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 30,
              }}
              data-arrow-layout={arrowLayout}
            >
              <img
                className={styles.label_image}
                data-active={isActive || isOpen}
                src={ribosome_path}
              />
            </motion.div>
            <motion.div
              layout
              className={styles.label_content}
              data-open={isOpen}
              data-arrow-layout={layout}
            >
              <div>
                <span>Heading</span> <span>Subtitle</span>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
