import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchVideo, fetchLastHistory, postHistoryEvent } from "../lib/api";

export function useVideoPlayer(videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!videoId) return;
    const token = localStorage.getItem("access_token") || "";

    fetchVideo(videoId, token)
      .then(setVideo)
      .catch((err) => console.log("Auth Error", err));
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video) return;

    const token = localStorage.getItem("access_token") || "";
    videoEl.autoplay = true;

    // 前回の視聴位置を復元
    fetchLastHistory(videoId, token)
      .then((data) => {
        videoEl.currentTime = data.timestamp;
      })
      .catch((err) => console.log("Auth Error", err));

    // const onPlay = () =>
    //   postHistoryEvent(Number(videoId), "play", videoEl.currentTime, token);
    const onPause = () =>
      postHistoryEvent(Number(videoId), "pause", videoEl.currentTime, token);
    const onEnded = () =>
      postHistoryEvent(Number(videoId), "ended", videoEl.currentTime, token);

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
