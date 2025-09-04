import fetchWithRefresh from "@/app/home/api";

export async function fetchVideo(video_id: string, token: string) {
  let access = await fetchWithRefresh();

  if (access?.status == 200) {
    const access_token = localStorage.getItem('access_token')
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
}

export async function fetchLastHistory(videoId: string, token: string) {
  let access = await fetchWithRefresh();

  if (access?.status == 200) {
    const res = await fetch(`http://127.0.0.1:8000/histories/last/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  }

  return ;
}

export async function postHistoryEvent(
  videoId: number,
  eventType: string,
  timestamp: number,
  token: string
) {
  let access = await fetchWithRefresh();

  if (access?.status == 200) {
    const res = fetch(`http://127.0.0.1:8000/histories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        video_id: videoId,
        event_type: eventType,
        timestamp,
      }),
      credentials: "include",
    });
    return res;
  } else {
    return ;
  }
}
