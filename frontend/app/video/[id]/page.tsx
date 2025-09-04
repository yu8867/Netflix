"use client";

import { useParams, useRouter } from "next/navigation";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { postHistoryEvent } from "./lib/api";

const page = () => {
  const params = useParams();
  const videoId = params.id as string;
  const router = useRouter();
  const { videoRef, video } = useVideoPlayer(videoId);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;

    if (clickX > width / 2) {
      // 右半分 → 10秒進む
      videoEl.currentTime = Math.min(videoEl.currentTime + 3, videoEl.duration);
      videoEl.autoplay = true;
    } else {
      // 左半分 → 10秒戻る
      videoEl.currentTime = Math.max(videoEl.currentTime - 3, 0);
      videoEl.autoplay = true;
    }
    videoEl.autoplay = true;
  };

  const saveHistory = () => {
    const videoEl = videoRef.current;
    const token = localStorage.getItem("access_token") || "";

    if (videoEl) {
      postHistoryEvent(
        Number(videoId),
        "transition",
        videoEl.currentTime,
        token
      );
    }
    router.push("/home");
  };

  if (!video) { 
    return <div className="bg-black text-white min-h-screen">aa</div>;
  }
  
  return (
    <div className="bg-black text-white min-h-screen">
      <button
        onClick={saveHistory}
        className="bg-red-900 text-white px-6 m-4 text-2xl border rounded-2xl border-red-900 hover:transition-opacity"
      >
        <div>戻る</div>
      </button>
      <h1 className="text-3xl font-bold px-6 py-4">{video.title}</h1>
      {/* <p className="px-6 mb-4">{video.description}</p> */}
      <div className="flex justify-center" onClick={handleClick}>
        <video
          ref={videoRef}
          className="rounded-xl shadow-lg"
          width="1200"
          controls
          src={video.url}
        />
      </div>
    </div>
  );
};

export default page;
