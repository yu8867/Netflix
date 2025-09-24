async function userRegister(username: string, email: string, password: string) {
  let res = await fetch("http://127.0.0.1:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
    credentials: "include",
  });

  return res;
}

export default userRegister;
