import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/tiptap/styles.css";

import "./App.css";

import { VideoGalleryPage } from "@/pages/VideoGalleryPage";
import { ContentsPage } from "./pages/ContentsPage";
import { SandboxPage } from "./pages/SandboxPage";
import { VideoPage } from "./pages/VideoPage";



/**
 * Within VideoPage: 
 *  - sidebar needs to know what 
 */


const routes = [
    { path: "/", component: ContentsPage },
    { path: "/videos", component: VideoGalleryPage },
    { path: "/videos/:video_id", component: VideoPage },
    { path: '/sandbox', component: SandboxPage }
] as const;


type RoutePath = typeof routes[number]['path']

export { routes };
export type { RoutePath };


