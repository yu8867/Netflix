"use client";

import { useParams, useRouter } from "next/navigation";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { postHistoryEvent } from "./lib/api";
import { useState } from "react";

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const page = () => {
  const params = useParams();
  const videoId = params.id as string;
  const router = useRouter();
  const { videoRef, video } = useVideoPlayer(videoId);
  const [rightArrow, setRightArrow] = useState(false);
  const [leftArrow, setLeftArrow] = useState(false);
  const [start, setStart] = useState(false);
  const [stop, setStop] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    const centerZone = width * 0.25; // 中央の幅（全体の25%を中央扱い）
    const leftBoundary = width / 2 - centerZone / 2;
    const rightBoundary = width / 2 + centerZone / 2;

    if (clickX >= leftBoundary && clickX <= rightBoundary) {
      // 中央ゾーン → 再生 / 一時停止をトグル
      if (videoEl.paused) {
        videoEl.autoplay = true;
        setStart(true);
        await sleep(500);
        setStart(false);
      } else {
        videoEl.autoplay = false;
        setStop(true);
        await sleep(500);
        setStop(false);
      }
    } else if (clickX > width / 2) {
      // 右半分 → 3秒進む
      videoEl.currentTime = Math.min(videoEl.currentTime + 3, videoEl.duration);
      setRightArrow(true);
      await sleep(800);
      setRightArrow(false);
      videoEl.autoplay = true;
      videoEl.play();
    } else {
      // 左半分 → 3秒戻る
      videoEl.currentTime = Math.max(videoEl.currentTime - 3, 0);
      setLeftArrow(true);
      await sleep(800);
      setLeftArrow(false);
      videoEl.autoplay = true;
      videoEl.play();
    }
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
    return <div className="bg-black text-white min-h-screen">loading</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute flex items-center justify-center">
        <button
          onClick={saveHistory}
          className="relative z-10 bg-red-900 text-white px-6 m-2 text-2xl border rounded-2xl border-red-900 hover:transition-opacity cursor-pointer hover:bg-red-600"
        >
          <div className="text-xl">戻る</div>
        </button>
        <h1 className="text-2xl font-bold px-4 py-4">{video.title}</h1>
      </div>

      <div className="absolute inset-0">
        {leftArrow && (
          <div className="p-2 absolute bg-black/50 text-2xl top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 text-white z-10">
            ＜＜3秒
          </div>
        )}
        {start && (
          <div className="p-2 absolute bg-black/50 text-2xl top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-white z-10">
            ▶
          </div>
        )}
        {stop && (
          <div className="p-2 absolute bg-black/50 text-2xl top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-white z-10">
            ⏸
          </div>
        )}
        {rightArrow && (
          <div className="p-2 absolute bg-black/50 text-2xl top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 text-white z-10">
            ＞＞3秒
          </div>
        )}
      </div>
      {/* <p className="px-6 mb-4">{video.description}</p> */}
      <div className="flex justify-center" onClick={handleClick}>
        <video
          ref={videoRef}
          className="rounded-xl shadow-lg w-full h-full object-fit"
          width="1200"
          controls
          src={video.video_url}
        />
      </div>
    </div>
  );
};

export default page;
