import { CreateVideoComment, VideoComment } from "@/models/comment";
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

    console.log(response)

    return response.json()
}

const getCommentsByVideoId = async (videoId: string): Promise<Array<VideoComment>> => {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'GET',
    });


    return response.json();
};



export { getCommentsByVideoId, createComment };

