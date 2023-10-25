import { VideoEditor } from "@/component/video-editor";
import { useRoute } from "wouter";
import styles from "./video-editor-page.module.css";

const VideoEditorPage = () => {
  const [, params] = useRoute("/editor/videos/:video_id*");

  return (
    <div className={styles.video_editor_wrapper}>
      <div className={styles.video_editor}>
        {params?.video_id ? (
          <VideoEditor videoId={params?.video_id} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export { VideoEditorPage };
