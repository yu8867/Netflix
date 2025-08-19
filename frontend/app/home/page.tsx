"use client";

import { useEffect, useState } from "react";
import ScrollToVideo from "../home/components/ScrollToVideo";
import fetchWithRefresh from "./api";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetchWithRefresh();
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setLoading(false);
      } else {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return;
  }

  if (!user) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p>
          ❌ ログインしてください →
          <a href="/login" className="text-red-500 underline">
            ログインページへ
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center py-6">
        🎬 MyFlix {user.email}
      </h1>
      <ScrollToVideo />
      <ScrollToVideo />
      <ScrollToVideo />
    </div>
  );
}
