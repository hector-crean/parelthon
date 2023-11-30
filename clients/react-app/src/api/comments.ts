import { CreateVideoComment, VideoComment } from "@/models/comment";
import { Video } from "@/models/video";
import { API_BASE_URL } from ".";

const createComment = async (requestBody: CreateVideoComment): Promise<VideoComment> => {

    const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(requestBody)
    });

    return response.json()
}

const getCommentsByVideoId = async (videoId: string): Promise<Array<VideoComment>> => {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'GET',
    });


    return response.json();
};

const getVideoWithCommentsByVideoId = async (videoId: string): Promise<{ video: Video, comments: Array<VideoComment>, videos: Array<Video> }> => {
    const commentByVideoIdResp = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'GET',
    });
    const videoByVideoIdResp = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'GET',
    });

    const videosResp = await fetch(`${API_BASE_URL}/videos`, {
        method: 'GET',
    });


    const video = await videoByVideoIdResp.json();
    const comments = await commentByVideoIdResp.json();
    const videos = await videosResp.json()




    return {
        video: video,
        comments: comments,
        videos: videos,
    }
};

export { getCommentsByVideoId, createComment, getVideoWithCommentsByVideoId };

