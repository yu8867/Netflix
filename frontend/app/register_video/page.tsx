"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import fetchWithRefresh from "../utils/api";
import { useRouter } from "next/navigation";
import registerVideo from "./api/registerVideo";
import getGenresTags from "./api/getGenre";
import registerGenre from "./api/registerGenre";
import upLoadS3 from "./api/upLoadS3";

const page = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videolPreview, setVideolPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<bool>(false);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [selectGenre, setSelectGenre] = useState<number[]>([]);
  const [newGenre, setNewGenre] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError("タイトルが入力されていません");
    if (!description) return setError("詳細が入力されていません");
    if (!selectGenre) return setError("詳細が入力されていません");
    if (!thumbnail) return setError("画像がアップロードされていません");
    if (!video) return setError("動画がアップロードされていません");

    setError("");
    setLoading(true);

    const thumbnail_url = await upLoadS3(thumbnail, "image");
    const video_url = await upLoadS3(video, "video");
    const genre_ids = selectGenre.map((id) => Number(id));

    const res = await registerVideo(
      title,
      description,
      genre_ids,
      thumbnail_url,
      video_url
    );

    if (res?.ok) {
      setLoading(false);
      setTitle("");
      setVideo("");
      setVideolPreview("");
      setDescription("");
      setThumbnailPreview("");
      localStorage.removeItem("title");
      localStorage.removeItem("description");
      localStorage.removeItem("thumbnail_preview");
      localStorage.removeItem("thumbnail");
    }
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
    } else {
      setThumbnailPreview(null);
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
  };

  const deleteVideoChanege = () => {
    setVideo("");
    setVideolPreview(null);
  };

  const getGenre = async () => {
    const genre = await getGenresTags();
    setGenre(genre);
  };

  const addGenre = async () => {
    const res = await registerGenre(newGenre);
    getGenre();
    setNewGenre("");
  };

  useEffect(() => {
    const getGenre = async () => {
      const genre = await getGenresTags();
      setGenre(genre);
    };

    const res = fetchWithRefresh();
    if (!res) {
      router.push("/login");
    }

    const title = localStorage.getItem("title");
    if (title) {
      setTitle(title);
    }
    const description = localStorage.getItem("description");
    if (description) {
      setDescription(description);
    }
    getGenre();
  }, []);

  return (
    <>
      <Header className="text-white" />
      <div className="ml-[8.25%]">
        <div className="text-white flex items-center justify-center">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-700">アップロード中です</p>
              </div>
            </div>
          )}
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

              {/* ジャンル */}
              <div className="border-2 border-white p-2">
                <div className="text-white text-2xl">ジャンル</div>
                <div className="grid grid-cols-4 gap-2">
                  {genre.map((g) => (
                    <label key={g.id} className="text-white cursor-pointer">
                      <input
                        type="checkbox"
                        value={g.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectGenre([...selectGenre, g.id]);
                          } else {
                            setSelectGenre(
                              selectGenre.filter((id) => id != g.id)
                            );
                          }
                        }}
                        className="w-8 h-4 accent-red-500"
                      />
                      <span>{g.genre}</span>
                    </label>
                  ))}
                </div>
                <div className="my-2 flex items-center justify-center gap-2">
                  <input
                    type="text"
                    placeholder="ジャンルの追加"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="p-1 text-white border-2 hover:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={addGenre}
                    className="w-[128px] p-1 border-2 border-white rounded-xl cursor-pointer hover:bg-white hover:text-black"
                  >
                    追加
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 mb-8">
                <button
                  type="submit"
                  className="min-w-128 p-1 cursor-pointer border-2 bg-white text-black rounded-xl hover:bg-gray-300"
                >
                  登録する
                </button>
                {error ? <div className="text-red-500">{error}</div> : <></>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
