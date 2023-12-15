import ribosome_path from "@/assets/images/ribosome.jpeg";
import { useStageContext } from "@/context/StageContext";
import { AppState } from "@/models/canvas";
import { VideoComment } from "@/models/comment";
import { TextInput } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import styles from "./Label.module.css";



export type Quadrant = `${"top" | "bottom"}-${"left" | "right"}`;
type Interval = { start: number; end: number };

interface LabelProps {
  comment: VideoComment;
  // currentTime: number;
  arrowLayout?: Quadrant;
  appState: AppState;
}

export const Label = ({ comment, arrowLayout, appState }: LabelProps) => {
  const { time: currentTime } = useStageContext();

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

  // the coordinate system origin starts in the top left:

  const quadrantFn = (x: number, y: number): Quadrant => {
    //top right
    if (x >= 0.5 * 100 && y <= 0.5 * 100) {
      return "top-right";
    }
    //top left
    if (x < 0.5 * 100 && y <= 0.5 * 100) {
      return "top-left";
    }
    //bottom right
    if (x >= 0.5 * 100 && y > 0.5 * 100) {
      return "bottom-right";
    }
    //bottom left
    if (x < 0.5 * 100 && y > 0.5 * 100) {
      return "bottom-left";
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

  const INITIAL_CONTENT = "Label Content";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: INITIAL_CONTENT,
  });

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
              <TextInput label="Title" placeholder="title" />{" "}
              <RichTextEditor
                editor={editor}
                styles={{
                  content: {
                    color: "white",
                    backgroundColor: "black",
                    border: "0px",
                  },
                }}
              >
                <RichTextEditor.Content />
              </RichTextEditor>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
