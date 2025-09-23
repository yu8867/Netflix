async function getGenreVideo(genre: string) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/videos/genres/${genre}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status == 401) {
    return [];
  }

  const data = await res.json();
  return data;
}

export default getGenreVideo;
