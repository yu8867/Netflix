export async function fetchVideo(video_id: string, token: string) {
  const res = await fetch(`http://127.0.0.1:8000/videos/${video_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Unauthorized");
  }
  return res.json();
}

export async function fetchLastHistory(videoId: string, token: string) {
  const res = await fetch(`http://127.0.0.1:8000/histories/last/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
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
  console.log(eventType, timestamp);
  return fetch(`http://127.0.0.1:8000/histories/`, {
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
  });
}
