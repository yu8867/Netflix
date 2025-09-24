async function registerGenre(newGenre: string) {
  if (!newGenre) {
    return;
  }

  const res = await fetch(`http://127.0.0.1:8000/videos/genres/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      genre: newGenre,
    }),
    credentials: "include",
  });

  return res;
}

export default registerGenre;
