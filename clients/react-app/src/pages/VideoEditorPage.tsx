import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { QueryResult } from "@/component/QueryResult";
import { VideoPlayer, VideoPlayerMode } from "@/component/VideoPlayer";
import { VideoLayout } from "@/layouts/VideoLayout";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";

const VideoEditorPage = () => {
  const [_, params] = useRoute("/editor/videos/:video_id*");

  const videoId = params?.video_id;

  if(!videoId) return null;

  const getVideoWithCommentsQuery = useQuery({
    queryKey: [`video:${videoId}`],
    queryFn: () => getVideoWithCommentsByVideoId(videoId),
  });

  return (
    <QueryResult queryResult={getVideoWithCommentsQuery}>
      {({ data }) => (
        <VideoLayout>
          <VideoPlayer
          videoPayload={data.video}
          mode={VideoPlayerMode.Editor}
          videoComments={data.comments}
        />
        </VideoLayout>
      )}
    </QueryResult>
  );
};




export { VideoEditorPage };
