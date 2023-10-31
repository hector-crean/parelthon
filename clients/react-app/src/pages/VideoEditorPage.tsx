import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { QueryResult } from "@/component/QueryResult";
import {
  VideoPlayer,
  VideoPlayerMode,
} from "@/component/video-player/VideoPlayer";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import styles from "./video-editor-page.module.css";

const VideoEditorPage = () => {
  const [, params] = useRoute("/editor/videos/:video_id*");

  return (
    <div className={styles.video_editor_wrapper}>
      <div className={styles.video_editor}>
        {params?.video_id ? (
          <VideoEditorPageInner videoId={params?.video_id} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

interface VideoEditorPageInnerProps {
  videoId: string;
}

const VideoEditorPageInner = ({ videoId }: VideoEditorPageInnerProps) => {
  const getVideoWithCommentsQuery = useQuery({
    queryKey: [`video:${videoId}`],
    queryFn: () => getVideoWithCommentsByVideoId(videoId),
  });

  return (
    <QueryResult queryResult={getVideoWithCommentsQuery}>
      {({ data }) => (
        <VideoPlayer
          videoPayload={data.video}
          mode={VideoPlayerMode.Editor}
          videoComments={data.comments}
        />
      )}
    </QueryResult>
  );
};

export { VideoEditorPage };
