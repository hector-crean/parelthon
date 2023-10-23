import React, { DragEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodError, ZodType, z } from "zod";

const Uuid = z.string(); // Assuming Uuid is represented as a string

const Video = z.object({
  video_id: Uuid,
  title: z.string(),
  description: z.union([z.string(), z.null()]), // Option<String> is represented as string | null
  s3_key: z.string(),
  s3_url: z.string(),
  created_at: z.string(), // Assuming chrono::DateTime<chrono::Utc> is represented as a string
  updated_at: z.string(), // Assuming chrono::DateTime<chrono::Utc> is represented as a string
});

const CreateVideo = z.object({
  title: z.string(),
  description: z.union([z.string(), z.null()]), // Option<String> is represented as string | null
  file: z.instanceof(File),
});

const GetVideo = z.object({
  video_id: Uuid, // Assuming Uuid is represented as a string
});

const ENDPOINT_BASE = "http://localhost:1690/v1/api";

async function create_video(
  create_video: z.infer<typeof CreateVideo>
): Promise<z.infer<typeof Video>> {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(create_video),
  };

  try {
    const response = await fetch(`${ENDPOINT_BASE}/video`, requestOptions);

    if (!response.ok) {
      // Handle error here if the response status is not ok (e.g., non-2xx status code)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const parsedVideo = Video.parse(json);
    return parsedVideo;
  } catch (error) {
    // Handle any network or parsing errors
    console.error("Error:", error);
    throw error; // You can handle or rethrow the error as needed
  }
}

// Create a custom hook to validate your form data
function useZodForm<T>(schema: ZodType<T>) {
  return (data: unknown): T => {
    const result = schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      throw result.error;
    }
  };
}

type FormData = z.infer<typeof CreateVideo>;

const VideoForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const validData = useZodForm(CreateVideo)(data);
      // Handle valid data here, e.g., send it to the server
      await create_video(validData);

      console.log(validData);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation error
        console.error("Validation error:", error);
      } else {
        // Handle other errors
        console.error("Unknown error:", error);
      }
    }
  };

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error("There was an issue reading the file.");
      };

      reader.readAsDataURL(file);
      return reader;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" {...register("title")} />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register("description")} />
        {errors.description && <span>{errors.description.message}</span>}
      </div>

      <div>
        <input
          type="file"
          id="input-file-upload"
          multiple={false}
          {...register("file")}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
              width: "300px",
              border: "1px dotted",
              backgroundColor: dragActive ? "lightgray" : "white",
            }}
          >
            Drag and drop some files here
          </div>
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export { VideoForm };
