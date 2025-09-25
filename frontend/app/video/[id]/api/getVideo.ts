async function fetchVideo(video_id: string) {
  const access_token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/videos/${video_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Unauthorized");
  }
  return res.json();
}

export default fetchVideo;
