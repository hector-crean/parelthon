import { VideoComment } from "@/models/comment";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styles from "./ThreadComment.module.css";
interface ThreadCommentProps {
  comment: VideoComment;
}
const ThreadComment = ({ comment }: ThreadCommentProps) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div className={styles.container}>
      <motion.header
        className={styles.comment_header}
        initial={false}
        animate={{ backgroundColor: open ? "#FF0088" : "#0055FF" }}
        onClick={() => setOpen(!open)}
      >
        {comment.comment_id}
      </motion.header>
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            className={styles.comment_body}
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {comment.comment_text}
          </motion.section>
        )}
      </AnimatePresence>{" "}
    </motion.div>
  );
};

export { ThreadComment };
