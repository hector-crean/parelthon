import { getVideoById } from "@/api/videos";
import { QueryResult } from "@/component/QueryResult";
import { AspectRatio, Flex, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { VideoPlayer, VideoPlayerMode } from "../video-player/VideoPlayer";

interface VideoEditorProps {
  videoId: string;
}
const VideoEditor = ({ videoId }: VideoEditorProps) => {
  const videoQuery = useQuery({
    queryKey: [`video:${videoId}`],
    queryFn: () => getVideoById(videoId),
  });

  //timestamped comments

  return (
    <QueryResult
      queryResult={videoQuery}
      renderLoading={() => <div>Loading</div>}
      renderError={(error) => <div>Error</div>}
    >
      {({ data }) => {
        return (
          <Flex direction={"column"} style={{ width: "100%" }}>
            <AspectRatio ratio={16 / 9}>
              <VideoPlayer src={data.s3_url} mode={VideoPlayerMode.Editor} />
            </AspectRatio>
            <Title order={1}>{data.title}</Title>
            <p>{data.description}</p>
          </Flex>
        );
      }}
    </QueryResult>
  );
};

export { VideoEditor };
