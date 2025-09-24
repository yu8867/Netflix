import React, { useEffect, useState } from "react";
import Card from "./VideoCard";
import getNewVideo from "../api/new";

const LatestVideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNewVideo();
      setVideos(data);
    };
    fetchData();
  }, []);

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
