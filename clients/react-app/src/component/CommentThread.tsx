import { VideoComment } from "@/models/comment";
import { Accordion } from "@mantine/core";
import { useState } from "react";
import styles from "./CommentThread.module.css";
interface CommentThreadProps {
  timeActiveCommentIds: string[];
  selectedCommentId: string | null;
  comments: Array<VideoComment>;
}

const CommentThread = ({
  comments,
  timeActiveCommentIds,
}: CommentThreadProps) => {
  const [openedCommentIds, setOpenedCommentIds] = useState<string[]>([]);
  return (
    <Accordion<true>
      multiple
      value={openedCommentIds}
      onChange={setOpenedCommentIds}
      classNames={{
        root: styles.root,
        item: styles.item,
        control: styles.control,
        chevron: styles.chevron,
        label: styles.label,
        icon: styles.icon,
        itemTitle: styles.item_title,
        panel: styles.panel,
        content: styles.content,
      }}
    >
      {comments.map((comment) => (
        <Accordion.Item value={comment.comment_id}>
          <Accordion.Control>{comment.comment_id}</Accordion.Control>
          <Accordion.Panel>panel-1</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export { CommentThread };
