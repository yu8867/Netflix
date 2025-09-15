"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videolPreview, setVideolPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, seTLoading] = useState<bool>(true);

  const uploadToS3 = async (file: File, type: "imgae" | "video") => {
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
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError("タイトルが入力されていません");
    if (!description) return setError("詳細が入力されていません");
    if (!thumbnail) return setError("画像がアップロードされていません");
    if (!video) return setError("動画がアップロードされていません");

    setError("");

    // const thumbnail_url = await uploadToS3(thumbnail, "image");
    // const video_url = await uploadToS3(video, "video");

    // let res = await fetch(`http://127.0.0.1:8000/videos`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     title,
    //     description,
    //     thumbnail_url,
    //     video_url,
    //   }),
    //   credentials: "include",
    // });
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    localStorage.setItem("title", e.target.value);
  };

  const handleDescriptionChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(e.target.value);
    localStorage.setItem("description", e.target.value);
  };

  const handleThumbnailChange = async (file: File | null) => {
    if (file) {
      setThumbnail(file);
      const base64 = await toBase64(file);
      setThumbnailPreview(base64);
      localStorage.setItem("thumbnail_preview", base64); // 保存
      localStorage.setItem("thumbnail", file);
    } else {
      setThumbnailPreview(null);
      localStorage.removeItem("thumbnail");
    }
  };

  const handleVideoChange = async (file: File | null) => {
    if (file) {
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideolPreview(url);
    } else {
      setVideo(null);
      setVideolPreview(null);
    }
  };

  const deleteThumbnailChanege = () => {
    setThumbnailPreview(null);
    setThumbnail("");
    localStorage.removeItem("thumbnail");
    localStorage.removeItem("thumbnail_preview");
  };

  const deleteVideoChanege = () => {
    setVideo("");
    setVideolPreview(null);
  };

  useEffect(() => {
    const title = localStorage.getItem("title");
    if (title) {
      setTitle(title);
    }
    const description = localStorage.getItem("description");
    if (description) {
      setDescription(description);
    }
    const thumbnail_preview = localStorage.getItem("thumbnail_preview");
    if (thumbnail_preview) {
      setThumbnailPreview(thumbnail_preview);
    }
  }, []);

  return (
    <div className="text-white flex items-center justify-center">
      <div>
        <div className="m-8">
          <h1 className="text-4xl text-center font-bold m-4 mb-12">
            映画の追加
          </h1>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6">
          {/* 動画 */}
          {videolPreview ? (
            <div>
              <div className="flex justify-end">
                <button
                  onClick={deleteVideoChanege}
                  className="border-2 text-white p-1 hover:bg-white cursor-pointer"
                >
                  ❌
                </button>
              </div>
              <div className="mt-4 flex flex-center justify-center">
                <video src={videolPreview} controls className="w-220" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <label className="text-white border-2 w-[1300px] h-120 p-2 text-center cursor-pointer hover:bg-gray-800">
                <div className="h-110 flex flex-col items-center justify-center gap-2">
                  <img src="./upload.svg" width={48} />
                  <p>動画をアップロードする</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleVideoChange(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div className="flex gap-6">
            <div className="grid grid-cols-1 gap-6">
              {/* タイトル */}
              <div>
                <input
                  type="textarea"
                  placeholder="タイトル"
                  value={title}
                  onChange={(e) => handleTitleChange(e)}
                  className="text-white border-2 w-2xl p-2 hover:bg-gray-800"
                />
              </div>

              {/* 詳細 */}
              <div>
                <textarea
                  placeholder="詳細"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e)}
                  className="text-white border-2 w-2xl h-79 p-2 hover:bg-gray-800"
                />
              </div>
            </div>

            {/* サムネイル画像 */}
            <div className="">
              {thumbnailPreview ? (
                <div>
                  <div className="flex justify-end">
                    <button
                      onClick={deleteThumbnailChanege}
                      className="border-2 text-white p-1 hover:bg-white cursor-pointer"
                    >
                      ❌
                    </button>
                  </div>
                  <div className="mt-4 flex flex-center justify-center">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      width={360}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <label className="border-2 w-2xl h-96 p-2 text-center cursor-pointer hover:bg-gray-800">
                    <div className="h-92 flex flex-col items-center justify-center gap-2">
                      <img src="./upload.svg" width={48} className="" />
                      <p>画像をアップロードする</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleThumbnailChange(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/*  */}

          <div className="flex flex-col items-center justify-center gap-4">
            <button
              type="submit"
              className="min-w-48 p-1 cursor-pointer border-2 bg-white text-black rounded-xl"
            >
              登録する
            </button>
            {error ? <div className="text-red-500">{error}</div> : <></>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
