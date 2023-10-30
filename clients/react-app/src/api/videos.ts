import axios from "axios";
import { API_BASE_URL } from '.';
import { CreateVideoFromFile, Video } from "../models/video";



const createVideo = async (createVideoPayload: CreateVideoFromFile): Promise<Video> => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/videos`,
            createVideoPayload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;

    } catch (error) {
        console.error(`Failed to create video: ${error}`);
        throw new Error(`Failed to create video: ${error}`);
    }
};

const getVideos = async (): Promise<Array<Video>> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/videos`);
        return data
        throw new Error("Unexpected API response.");
    } catch (error) {
        console.error(`Failed to fetch videos: ${error}`);
        throw new Error(`Failed to fetch videos: ${error}`);
    }
};



const getVideoById = async (videoId: string): Promise<Video> => {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'GET',
    });

    console.log(response)

    return response.json();
};




export { createVideo, getVideoById, getVideos };
