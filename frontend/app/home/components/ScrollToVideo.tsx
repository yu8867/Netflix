import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import fetchWithRefresh from "../api";

const ScrollToVideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      let res = await fetchWithRefresh();
      if (res?.ok) {
        let token = localStorage.getItem("access_token");
        let res = await fetch("http://127.0.0.1:8000/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        // リソースがない場合
        if (res.status == 404) {
          return setVideos([]);
        }
        const data = await res.json();
        setVideos(data);
      } else {
        router.push("/login");
      }
    };
    checkUser();
  }, []);

  console.log(videos);

  return (
    <div className="px-6 my-12">
      <h2 className="text-4xl mb-3">おすすめ作品</h2>
      <div className="flex space-x-4 overflow-x-auto p-4 mx-4">
        {videos.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0 w-[450px] cursor-pointer">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-max h-[300px] object-contain border-2 rounded-xl border-[#b20710] shadow-lg hover:scale-103 transition-transform"
                />
                <p className="mt-2 text-sm text-center">{video.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScrollToVideo;
