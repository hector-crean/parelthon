import axios, { AxiosResponse } from "axios";
import { CreateVideoFromFile, Video } from "../models/video";

import { AspectRatio, Flex, Group, Text, TextInput, rem } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

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

const VideoForm = () => {
  const methods = useForm<CreateVideoFromFile>();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const onSubmit = async (formData: CreateVideoFromFile) => {
    const resp = await createVideo(formData);

    if (resp.data) {
      setVideoUrl(resp.data.s3_url);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Controller
            control={methods.control}
            name="file"
            render={({}) => (
              <Flex direction={"column"} gap={rem(2)}>
                <Dropzone
                  onDrop={(files) => {
                    const url = URL.createObjectURL(files[0]);

                    setVideoUrl(url);

                    methods.setValue("file", files[0]);
                  }}
                  onReject={(files) => console.log("rejected files", files)}
                  // maxSize={3 * 1024 ** 2}
                  accept={["video/mp4"]}
                  multiple={false}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-blue-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-red-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text size="xl" inline>
                        Drag images here or click to select files
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not
                        exceed 5mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                <div style={{ width: "100%" }}>
                  {videoUrl && (
                    <AspectRatio ratio={16 / 9}>
                      <video src={videoUrl} />
                    </AspectRatio>
                  )}
                </div>
                <TextInput
                  id="title"
                  variant="filled"
                  placeholder="title"
                  {...methods.register("title", { required: true })}
                />
                <TextInput
                  id="description"
                  variant="filled"
                  placeholder="description"
                  {...methods.register("description", { required: true })}
                />

                <input type="submit" />
              </Flex>
            )}
          />
        </form>
      </FormProvider>
    </>
  );
};

export { VideoForm };
