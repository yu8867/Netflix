async function fetchWithRefresh() {
  let token = localStorage.getItem("access_token");

  let res = await fetch(`http://127.0.0.1:8000/auth/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  // アクセストークンが切れている
  if (res.status == 401) {
    const refreshRes = await fetch(`http://127.0.0.1:8000/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    // リフレッシュできた場合
    if (refreshRes.ok) {
      const { access_token } = await refreshRes.json();
      localStorage.setItem("access_token", access_token);
      const new_access_token = localStorage.getItem("access_token");

      // アクセストークンが発行された場合
      if (access_token) {
        res = await fetch(`http://127.0.0.1:8000/auth/account`, {
          headers: {
            Authorization: `Bearer ${new_access_token}`,
          },
          credentials: "include",
        });
      }
    } else {
      return;
    }
  }
  return res;
}

export default fetchWithRefresh;
