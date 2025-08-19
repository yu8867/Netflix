const API_URL = "http://127.0.0.1:8000";

async function fetchWithRefresh() {
  let token = localStorage.getItem("access_token");

  let res = await fetch("http://127.0.0.1:8000/auth/account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status == 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { access_token } = await refreshRes.json();
      localStorage.setItem("access_token", access_token);

      res = await fetch("http://127.0.0.1:8000/auth/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    }
  }
  return res;
}

export default fetchWithRefresh;
