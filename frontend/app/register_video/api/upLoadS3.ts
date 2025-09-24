async function upLoadS3(file: File, type: "image" | "video") {
  const res = await fetch(
    `http://127.0.0.1:8000/videos/upload-url/?filename=${encodeURIComponent(
      file.name
    )}&content_type=${file.type}&filetype=${type}`
  );
  const { url, path } = await res.json();

  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  return path;
}

export default upLoadS3;
