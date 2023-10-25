import { z } from 'zod';

const createVideoCommentSchema = z.object({
    video_id: z.union([z.string().uuid(), z.null()]).optional(),
    user_id: z.union([z.string().uuid(), z.null()]).optional(),
    comment_text: z.string(),
    coordinates: z.object({
        x: z.number(),
        y: z.number(),
    }),
    start_time: z.number(),
    end_time: z.union([z.number(), z.null()]).optional(),
});


const videoCommentSchema = z.object({
    comment_id: z.string().uuid(),
    user_id: z.union([z.string().uuid(), z.null()]).optional(),
    video_id: z.union([z.string().uuid(), z.null()]).optional(),
    start_time: z.number(),
    end_time: z.union([z.number(), z.null()]).optional(),
    updated_at: z.string().datetime(),
    screen_x: z.number(),
    screen_y: z.number(),
    comment_text: z.string(),
    created_at: z.string().datetime(),
});



type VideoComment = z.infer<typeof videoCommentSchema>;

type CreateVideoComment = z.infer<typeof createVideoCommentSchema>;


export type { VideoComment, CreateVideoComment };

