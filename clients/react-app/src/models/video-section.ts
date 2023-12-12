import { VideoComment } from "./comment";
import { Interval } from "./interval";
import { VideoAudioItem } from "./video-audio";

type VideoSection = {
    id: string;
    iv: Interval
    audioItems: Array<VideoAudioItem>,
    labels: Array<VideoComment>
  }
  


  export type { VideoSection };
