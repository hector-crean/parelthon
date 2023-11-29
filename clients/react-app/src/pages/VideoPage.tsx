import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { CommentThread } from "@/component/CommentThread";
import { QueryResult } from "@/component/QueryResult";
import { VideoPlayer, VideoPlayerMode } from "@/component/VideoPlayer";
import { VideoLayout } from "@/layouts/VideoLayout";
import { RoutePath } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { create } from "zustand";

interface VideoPageStore {
  activeCommentIds: Array<string>;
  setActiveCommentIds: (ids: string[]) => void;
  addActiveCommentId: (id: string) => void;
  removeActiveCommentId: (id: string) => void;
}

const useVideoPageStore = create<VideoPageStore>()((set) => ({
  activeCommentIds: [],
  setActiveCommentIds: (ids: string[]) => set({ activeCommentIds: ids }),
  addActiveCommentId: (id: string) =>
    set((state) => ({
      activeCommentIds: [...new Set([...state.activeCommentIds, id])],
    })),
  removeActiveCommentId: (id: string) =>
    set((state) => ({
      activeCommentIds: state.activeCommentIds.filter((c) => c === id),
    })),
}));

////

const VideoPage = () => {
  const videoPageStore = useVideoPageStore();

  const [_isRoute, params] = useRoute("/videos/:video_id" satisfies RoutePath);
  const [_location, setLocation] = useLocation();

  if (!params) return null;

  const videoId = params.video_id;

  const getVideoWithCommentsQuery = useQuery({
    queryKey: [`video:${videoId}`],
    queryFn: () => getVideoWithCommentsByVideoId(videoId),
  });

  return (
    <QueryResult queryResult={getVideoWithCommentsQuery}>
      {({ data: { video, comments } }) => (
        <VideoLayout
          video={
            <VideoPlayer
              videoPayload={video}
              mode={VideoPlayerMode.Editor}
              videoComments={comments}
              changeVideo={(videoId: string) =>
                setLocation(`/videos/${videoId}`)
              }
            />
          }
          sidebar={
            <CommentThread
              comments={comments}
              timeActiveCommentIds={videoPageStore.activeCommentIds}
            />
          }
          expandingFooter={
            <section id="video-overview">
              <h1>{video.title}</h1>
              <h2>{video.created_at}</h2>
            </section>
          }
        />
      )}
    </QueryResult>
  );
};

export { useVideoPageStore };
export { VideoPage };
