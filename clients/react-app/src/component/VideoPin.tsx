import { VideoComment } from "@/models/comment";
import { Popover } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { CommentAdder } from "./CommentAdder";

import { useDisclosure } from "@mantine/hooks";
import styles from "./VideoPin.module.css";
// Control how long should a pin stay on the video, before
// moving back to the controls.
const PIN_TIME_ON_VIDEO_SECONDS = 3;

interface VideoPinProps {
  comment: VideoComment;
  currentTime: number;
}
const VideoPin = ({
  comment: { screen_x, screen_y, start_time, end_time, comment_text },
  currentTime,
}: VideoPinProps) => {
  const [opened, { close, open, toggle }] = useDisclosure(false);

  return (
    <AnimatePresence>
      {true && (
        <Popover
          width={"min(60%, 800px)"}
          position="bottom"
          withArrow
          shadow="md"
          opened={opened}
        >
          <Popover.Target>
            <motion.div
              onClick={toggle}
              //   onHoverEnd={close}
              className={styles.video_pin}
              style={{
                transform: "translate(-50%, -50%)",

                zIndex: 200,
                position: "absolute",
                border: "1px solid black",
                backgroundColor: "transparent",
                left: `${screen_x}%`,
                top: `${screen_y}%`,
                width: 30,
                height: 30,
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
              }}
              initial={{
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 100,
                duration: 0.1,
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            >
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="red" />
              </svg>
            </motion.div>
          </Popover.Target>
          <Popover.Dropdown style={{ pointerEvents: "all" }}>
            <CommentAdder initialContent={comment_text} />
          </Popover.Dropdown>
        </Popover>
      )}
    </AnimatePresence>
  );
};

export { VideoPin };
