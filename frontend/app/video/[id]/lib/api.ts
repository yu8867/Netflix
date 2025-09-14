import fetchWithRefresh from "@/app/home/api";

export async function fetchVideo(video_id: string, token: string) {
  const access = await fetchWithRefresh();
  if (access?.status !== 200) {
    return;
  }
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

export async function fetchLastHistory(videoId: string, token: string) {
  const access = await fetchWithRefresh();
  if (access?.status !== 200) {
    return;
  }
  const access_token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/histories/last/${videoId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function postHistoryEvent(
  videoId: number,
  eventType: string,
  timestamp: number,
  token: string
) {
  const access = await fetchWithRefresh();
  if (access?.status !== 200) {
    return;
  }
  const access_token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/histories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      video_id: videoId,
      event_type: eventType,
      timestamp,
    }),
    credentials: "include",
  });
  return res;
}
