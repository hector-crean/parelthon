import { API_BASE_URL } from '.';
import { CreateVideoFromFile, Video } from '../models/video';

const createVideo = async (createVideoPayload: CreateVideoFromFile): Promise<Video> => {

    console.log(createVideoPayload)
    try {

        const formData = new FormData();
        formData.append('title', createVideoPayload.title);
        formData.append('description', createVideoPayload.description!);
        formData.append('file', createVideoPayload.file);


        const response = await fetch(`${API_BASE_URL}/videos`, {
            method: 'POST',

            body: formData
        });

        console.log(response)

        if (!response.ok) {
            // Handle non-successful response (e.g., 4xx or 5xx status codes)
            throw new Error(`Failed to create video: ${response.statusText}`);
        }

        const video = await response.json();
        return video;
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error creating video:', error);
        throw error;
    }
};

const getVideos = async (): Promise<Array<Video>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/videos`, {
            method: 'GET',
        });

        if (!response.ok) {
            // Handle non-successful response (e.g., 4xx or 5xx status codes)
            throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }

        const videos = await response.json();
        return videos;
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error fetching videos:', error);
        throw error;
    }
};

const getVideoById = async (videoId: string): Promise<Video> => {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            // Handle non-successful response (e.g., 4xx or 5xx status codes)
            throw new Error(`Failed to fetch video by ID: ${response.statusText}`);
        }

        const video = await response.json();
        return video;
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error fetching video by ID:', error);
        throw error;
    }
};

export { createVideo, getVideoById, getVideos };
