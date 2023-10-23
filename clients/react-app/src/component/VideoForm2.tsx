import { FileInput } from "@mantine/core";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { CreateVideoFromFile, Video } from "../models/video";

const API_BASE_URL = "http://localhost:1690/v1/api";

async function createVideo(
  createVideoPayload: CreateVideoFromFile
): Promise<AxiosResponse<Video>> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/video`,
      createVideoPayload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to create video: ${error}`);
  }
}

function VideoForm2() {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function handleFileInput(payload: File | null): Promise<void> {
      try {
        if (payload instanceof File) {
          console.log(payload);
          const createVideoPayload: CreateVideoFromFile = {
            title: "text",
            description: "generic description",
            file: payload,
          };

          const videoResponse = await createVideo(createVideoPayload);
        }
      } catch (error) {
        console.error(`Error handling file input: ${error}`);
      }
    }

    if (file) {
      handleFileInput(file);
    }
  }, [file]);

  return <FileInput onChange={(payload) => setFile(payload)} />;
}

export { VideoForm2 };
