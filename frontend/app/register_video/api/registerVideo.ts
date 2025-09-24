async function registerVideo(
  title: string,
  description: string,
  genre_ids: [],
  thumbnail_url: string,
  video_url: string
) {
  const res = await fetch(`http://127.0.0.1:8000/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      genre_ids,
      thumbnail_url,
      video_url,
    }),
    credentials: "include",
  });

  return res;
}

export default registerVideo;
