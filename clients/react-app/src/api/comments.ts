import { CreateVideoComment, VideoComment } from "@/models/comment";
import { Video } from "@/models/video";
import { API_BASE_URL } from ".";

const createComment = async (requestBody: CreateVideoComment): Promise<VideoComment> => {

    console.log(requestBody)


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

const getVideoWithCommentsByVideoId = async (videoId: string): Promise<{ video: Video, comments: Array<VideoComment> }> => {
    const commentResp = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'GET',
    });
    const videoResp = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'GET',
    });

    const video = await videoResp.json();
    const comments = await commentResp.json();

    return {
        video: video,
        comments: comments
    }
};

export { getCommentsByVideoId, createComment, getVideoWithCommentsByVideoId };

