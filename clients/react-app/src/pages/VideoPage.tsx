import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { QueryResult } from "@/component/QueryResult";
import { VideoPlayer, VideoPlayerMode } from "@/component/VideoPlayer";
import { StageProvider } from "@/context/StageContext";
import { VideoLayout } from "@/layouts/VideoLayout";
import { audiosExample } from "@/models/audio";
import { RoutePath } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { create } from "zustand";

function wrappedArrayLookup<T>(arr: T[], index: number): T {
  const length = arr.length;

  // Wrap around the index if it's out of bounds
  const wrappedIndex = ((index % length) + length) % length;

  return arr[wrappedIndex];
}

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
  //Query for video, contingent on the video_id
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
      {({ data: { video, comments, videos } }) => {
        const videoIdx = videos.findIndex((v) => v.video_id === video.video_id);

        return (
          <StageProvider>
            <VideoLayout
              video={
                <VideoPlayer
                  videoPayload={video}
                  mode={VideoPlayerMode.Editor}
                  videoComments={comments}
                  changeVideo={(videoId: string) =>
                    setLocation(`/videos/${videoId}`)
                  }
                  soundtrack={audiosExample}
                  nextVideo={wrappedArrayLookup(videos, videoIdx + 1)}
                  prevVideo={wrappedArrayLookup(videos, videoIdx - 1)}
                />
              }
              sidebar={<div></div>}
              expandingFooter={
                <section id="video-overview">
                  <h1>{video.title}</h1>
                  <h2>{video.created_at}</h2>
                </section>
              }
            />
          </StageProvider>

        );
      }}
    </QueryResult>
  );
};

export { VideoPage, useVideoPageStore };

