async function getGenresTags() {
  const res = await fetch(`http://127.0.0.1:8000/videos/genres/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res) {
    return [];
  }

  const data = await res.json();
  return data;
}

export default getGenresTags;
