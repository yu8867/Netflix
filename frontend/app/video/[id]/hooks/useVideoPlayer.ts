import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import fetchVideo from "../api/getVideo";
import fetchLastHistory from "../api/getLastHistory";
import postHistoryEvent from "../api/registerHistory";

export function useVideoPlayer(videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!videoId) return;

    fetchVideo(videoId)
      .then(setVideo)
      .catch((err) => console.log("Auth Error", err));
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video) return;

    videoEl.autoplay = true;

    // 前回の視聴位置を復元
    fetchLastHistory(videoId)
      .then((data) => {
        videoEl.currentTime = data.timestamp;
      })
      .catch((err) => console.log("Auth Error", err));

    const onPause = () =>
      postHistoryEvent(Number(videoId), "pause", videoEl.currentTime);
    const onEnded = () =>
      postHistoryEvent(Number(videoId), "ended", videoEl.currentTime);

    // videoEl.addEventListener("play", onPlay);
    videoEl.addEventListener("pause", onPause);
    videoEl.addEventListener("ended", onEnded);

    return () => {
      videoEl.removeEventListener("pause", onPause);
      videoEl.removeEventListener("ended", onEnded);
    };
  }, [video, pathname]);

  return { videoRef, video };
}
