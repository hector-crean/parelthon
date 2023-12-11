import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { CommentThread } from "@/component/CommentThread";
import { LayeredVideoPlayer } from "@/component/LayeredVideoPlayer";
import { QueryResult } from "@/component/QueryResult";
import { Tabable, Tabs } from "@/component/tabs/Tabs";
import { AppStateProvider } from "@/context/EditorContext";
import { StageProvider } from "@/context/StageContext";
import { PauseIcon } from "@/icons/Pause";
import { PlayIcon } from "@/icons/Play";
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

        const tabs = [
          {
            id: "tab-1",
            label: "Tab 1",
            icon: <PlayIcon />,
            tabBody: "This is the tab body",
          },
          {
            id: "tab-2",
            label: "Tab 2",
            icon: <PauseIcon />,
            tabBody: (
              <CommentThread comments={comments} timeActiveCommentIds={[]} />
            ),
          },
        ] satisfies Array<Tabable>;

        return (
          <AppStateProvider>
            <StageProvider>
              <VideoLayout
                video={
                  <LayeredVideoPlayer
                    videoPayload={video}
                    videoComments={comments}
                    changeVideo={(videoId: string) =>
                      setLocation(`/videos/${videoId}`)
                    }
                    soundtrack={audiosExample}
                    nextVideo={wrappedArrayLookup(videos, videoIdx + 1)}
                    prevVideo={wrappedArrayLookup(videos, videoIdx - 1)}
                  />
                }
                sidebar={<Tabs initialTabs={tabs} />}
                expandingFooter={
                  <>
                    <div>Video Title 1</div>
                    <div>{video.video_id}</div>
                  </>
                }
              />
            </StageProvider>
          </AppStateProvider>
        );
      }}
    </QueryResult>
  );
};

export { VideoPage, useVideoPageStore };
