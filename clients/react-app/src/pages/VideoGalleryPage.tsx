import { AspectRatio } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import { useLocation } from "wouter";
import { getVideos } from "../api/videos";
import { AddVideoCard } from "../component/AddVideoCard";
import { QueryResult } from "../component/QueryResult";
import { Video } from "../component/Video";
import { Video as VideoModel } from "../models/video";
import styles from "./VideoGallery.module.css";

type VideoCardProps = ComponentProps<typeof Video> & VideoModel;

const VideoCard = (props: VideoCardProps) => {
  const [location, setLocation] = useLocation();

  return (
    <AspectRatio ratio={16 / 9}>
      <Video
        {...props}
        onClick={() => setLocation(`/editor/videos/${props.video_id}`)}
      />
    </AspectRatio>
  );
};

const VideoGallery = () => {
  const videosQuery = useQuery({ queryKey: ["videos"], queryFn: getVideos });

  return (
    <div className={styles.video_gallery_wrapper}>
      <div className={styles.video_gallery}>
        <QueryResult queryResult={videosQuery}>
          {({ data }) => {
            return data.map((video) => (
              <VideoCard
                key={video.s3_key}
                src={video.s3_url}
                controls={false}
                {...video}
              />
            ));
          }}
        </QueryResult>
        <AddVideoCard refetchFn={videosQuery.refetch} />
      </div>
    </div>
  );
};

export { VideoGallery };
