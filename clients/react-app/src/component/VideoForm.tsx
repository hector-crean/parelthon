import { CreateVideoFromFile } from "../models/video";

import {
  AspectRatio,
  Center,
  Flex,
  Group,
  Loader,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

import { createVideo } from "@/api/videos";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { MutationResult } from "@/component/MutationResult";
import { Video } from "@/component/Video";
import { useMutation } from "@tanstack/react-query";



const VideoForm = () => {
  const methods = useForm<CreateVideoFromFile>();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: CreateVideoFromFile) => {
      return createVideo(formData);
    },
  });

  return (
    <MutationResult
      mutationResult={mutation}
      renderLoading={() => (
        <Flex direction={"column"} gap={rem(2)}>
          <Center>
            <Loader color="blue" />
            {videoUrl && <Video src={videoUrl} />}
          </Center>
        </Flex>
      )}
      renderInitial={() => (
        <Flex direction={"column"}>
          <div style={{ width: "100%" }}>
            {videoUrl && (
              <AspectRatio ratio={16 / 9}>
                <Video src={videoUrl} />
              </AspectRatio>
            )}
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((values) =>
                // ✅ reset client state back to undefined
                mutation.mutate(values, { onSuccess: () => methods.reset() })
              )}
            >
              <Flex direction={"column"} gap={rem(2)}>
                <Controller
                  control={methods.control}
                  name="file"
                  render={({ field }) => (
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
                            Attach as many files as you like, each file should
                            not exceed 5mb
                          </Text>
                        </div>
                      </Group>
                    </Dropzone>
                  )}
                />
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

                {/* <Controller
                  control={methods.control}
                  name="description"
                  render={({ field }) => (
                    <CustomRichTextEditor>
                      {({ html }) => (
                        <Button
                          onClick={() =>
                            methods.setValue("description", html ?? "")
                          }
                        >
                          Post
                        </Button>
                      )}
                    </CustomRichTextEditor>
                  )}
                /> */}

                <input type="submit" />
              </Flex>
            </form>
          </FormProvider>
        </Flex>
      )}
      renderError={() => <div>Error</div>}
    >
      {({ data }) => (
        <Flex direction={"column"} gap={rem(2)}>
          <Video src={data.s3_url} />
        </Flex>
      )}
    </MutationResult>
  );
};

export { VideoForm };
