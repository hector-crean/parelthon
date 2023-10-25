import { AspectRatio, Flex, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getVideoById } from '../../api/videos';
import { QueryResult } from '../QueryResult';
import { Video } from '../Video';


interface VideoEditorProps {
    videoId: string;
}
const VideoEditor = ({ videoId }: VideoEditorProps) => {



    const query = useQuery({ queryKey: [`video:${videoId}`], queryFn: () => getVideoById(videoId) })


    return (
        <QueryResult
            queryResult={query}
            renderLoading={() => <div>Loading</div>}
            renderError={(error) => <div>Error</div>}
        >
            {({ data }) => {
                return (
                    <Flex direction={'column'} style={{ width: '100%' }}>
                        <AspectRatio ratio={16 / 9}>
                            <Video src={data.s3_url} />
                        </AspectRatio>
                        <Title order={1} >{data.title}</Title>
                        <p>{data.description}</p>

                    </Flex>)
            }}
        </QueryResult>
    )
}



export { VideoEditor };





