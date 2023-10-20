import { ChangeEventHandler, FormEventHandler, useState } from "react";
import "./App.css";

import { z } from "zod";

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
  path_buf: z.string(), // Assuming PathBuf is represented as a string
});

const GetVideo = z.object({
  video_id: Uuid, // Assuming Uuid is represented as a string
});

const ENDPOINT_BASE = "localhost:1690/v1/api";

async function create_video(
  create_video: z.infer<typeof CreateVideo>
): Promise<z.infer<typeof Video>> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    path_buf: "",
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    await create_video(formData);
  };

  console.log(formData);

  return (
    <div className="container">
      <div>
        <h2>Create Video</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="path_buf">Path Buffer:</label>
            <input
              type="text"
              id="path_buf"
              name="path_buf"
              value={formData.path_buf}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
