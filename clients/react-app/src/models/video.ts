
import { z } from "zod";

const Uuid = z.string(); // Assuming Uuid is represented as a string

const videoSchema = z.object({
    video_id: Uuid,
    title: z.string(),
    description: z.union([z.string(), z.null()]), // Option<String> is represented as string | null
    s3_key: z.string(),
    s3_url: z.string(),
    created_at: z.string(), // Assuming chrono::DateTime<chrono::Utc> is represented as a string
    updated_at: z.string(), // Assuming chrono::DateTime<chrono::Utc> is represented as a string
});

const createVideoFromFileSchema = z.object({
    title: z.string(),
    description: z.union([z.string(), z.null()]), // Option<String> is represented as string | null
    file: z.instanceof(File)
});

const createVideoFromFilePathSchema = z.object({
    title: z.string(),
    description: z.union([z.string(), z.null()]), // Option<String> is represented as string | null
    path_buf: z.string(),
});



const getVideoSchema = z.object({
    video_id: Uuid, // Assuming Uuid is represented as a string
});


type Video = z.infer<typeof videoSchema>;
type CreateVideoFromFile = z.infer<typeof createVideoFromFileSchema>;
type CreateVideoFromFilePath = z.infer<typeof createVideoFromFilePathSchema>;

type GetVideo = z.infer<typeof getVideoSchema>;

export type { Video, CreateVideoFromFile, GetVideo, CreateVideoFromFilePath };
export { videoSchema, createVideoFromFileSchema, getVideoSchema, createVideoFromFilePathSchema };

