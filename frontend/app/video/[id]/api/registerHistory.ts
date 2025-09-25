async function postHistoryEvent(
  videoId: number,
  eventType: string,
  timestamp: number
) {
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

export default postHistoryEvent;
