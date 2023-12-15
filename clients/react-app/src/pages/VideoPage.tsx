import { getVideoWithCommentsByVideoId } from "@/api/comments";
import { AudioTrack } from "@/component/AudioTrack";
import { LayeredVideoPlayer } from "@/component/LayeredVideoPlayer";
import { QueryResult } from "@/component/QueryResult";
import { ScrollTimeline } from "@/component/ScrollTimeline";
import { VideoAnnotationCard } from "@/component/VideoAnnotationCard";
import { Tabs } from "@/component/tabs/Tabs";
import { videoSections } from "@/data/video-sections";
import { PlayIcon } from "@/icons/Play";
import { VideoLayout } from "@/layouts/VideoLayout";
import { RoutePath } from "@/routes";
import { useVideoStageStore } from "@/stores/stage.store";
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

  const store = useVideoStageStore();

  return (
    <QueryResult queryResult={getVideoWithCommentsQuery}>
      {({ data: { video, comments, videos } }) => {
        const videoIdx = videos.findIndex((v) => v.video_id === video.video_id);

        return (
          <VideoLayout
            video={
              <LayeredVideoPlayer
                videoId={videoId}
                videoPayload={video}
                changeVideo={(videoId: string) =>
                  setLocation(`/videos/${videoId}`)
                }
                videoSections={videoSections}
                nextVideo={wrappedArrayLookup(videos, videoIdx + 1)}
                prevVideo={wrappedArrayLookup(videos, videoIdx - 1)}
              />
            }
            sidebar={
              <Tabs
                initialTabs={[
                  {
                    id: 'annotations',
                    label: 'Annotations',
                    icon: <PlayIcon />,
                    tabBody: (
                      <VideoAnnotationCard />
                    )

                  },
                  {
                    id: "timeline",
                    label: "Timeline",
                    icon: <PlayIcon />,
                    tabBody: (
                      <ScrollTimeline
                        sections={videoSections}
                        renderSection={(props) => (
                          <>
                            {props.audioItems.map((audioItem, i) => (
                              <AudioTrack
                                key={`item-${i}`}
                                track={audioItem}
                                muted={true}
                                style={{ width: "100%", height: "200px" }}
                                visualiserVisible={true}
                              />
                            ))}
                          </>
                        )}
                        onScroll={(progress) => {
                          store.setIsPlaying(true);
                          const timeThrough = progress * store.duration;
                          // const vsections = videoSections.flatMap(
                          //   (s) => s.audioItems
                          // );

                          // const sorted = [...vsections].sort((a, b) =>
                          //   Math.abs(timeThrough - a.iv.start) >
                          //   Math.abs(timeThrough - b.iv.start)
                          //     ? -1
                          //     : Math.abs(timeThrough - a.iv.start) <
                          //       Math.abs(timeThrough - b.iv.start)
                          //     ? 1
                          //     : 0
                          // );

                          store.setTime(timeThrough);
                          store.setTimeIsSynced(false);
                        }}
                        progress={store.time / store.duration}
                        onSelectSection={(section) => {
                          store.setIsPlaying(true);
                          store.setTime(section.iv.start);
                          store.setTimeIsSynced(false);
                        }}
                      />
                    ),
                  },
                ]}
              />
            }
            expandingFooter={
              <>
                <div>Video Title 1</div>
                <div>{video.video_id}</div>
              </>
            }
          />
        );
      }}
    </QueryResult>
  );
};

export { VideoPage, useVideoPageStore };
