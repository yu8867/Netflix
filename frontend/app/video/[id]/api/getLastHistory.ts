async function fetchLastHistory(videoId: string) {
  const access_token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/histories/last/${videoId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export default fetchLastHistory;
