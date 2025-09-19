import Link from "next/link";
import React from "react";

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
};

type CardProps = {
  video: Video;
};

const VideoCard: React.FC<CardProps> = ({ video }) => {
  return (
    <div>
      <Link key={video.id} href={`/video/${video.id}`}>
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0 w-[450px] cursor-pointer p-2 border-2 border-[#b20710] rounded-xl hover:scale-103">
            <div className="grid grid-cols-1 items-center">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="mx-auto h-[300px] object-contain shadow-lg transition-transform"
              />
              <p className="mt-2 text-sm text-center">{video.title}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
