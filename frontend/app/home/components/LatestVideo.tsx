import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import fetchWithRefresh from "../api";
import Card from "./VideoCard";

const LatestVideo = () => {
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
    <>
      {videos.length !== 0 && (
        <div className="px-6 my-12">
          <h2 className="text-4xl mb-3">おすすめ作品</h2>
          <div className="flex space-x-4 overflow-x-auto p-4 mx-4">
            {videos.map((video) => (
              <Card key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default LatestVideo;
