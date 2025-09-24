"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import fetchLogin from "./api/login";
import Link from "next/link";

const page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchLogin(email, password);

    if (!res.ok) {
      setMessage("ログイン失敗。ユーザー名/パスワードを確認してください。");
      return;
    }

    // アクセストークン発行
    const token = await res.json();
    localStorage.setItem("access_token", token.access_token);
    router.push("/home");
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <div>
        <form className="w-96" onSubmit={handleLogin}>
          <h1 className="text-4xl text-center font-bold m-4 mb-12">
            ログイン画面
          </h1>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-white border-2 border-white py-2 px-4 rounded-xl"
            />
            <input
              type="text"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-white border-2 border-white p-2 px-4 rounded-xl"
            />
          </div>
          <button
            type="submit"
            className="mx-auto block bg-red-800 text-white p-2 mt-8 rounded-xl w-96"
          >
            <div>ログインする</div>
          </button>
          {message && <p className="text-red-900">{message}</p>}
        </form>
        <div className="my-4 text-center">
          <Link href="/register">新規登録はこちら</Link>
        </div>
      </div>
    </div>
  );
};

export default page;
