"use client";

import { useEffect, useState } from "react";
import ScrollToVideo from "../home/components/ScrollToVideo";
import fetchWithRefresh from "./api";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetchWithRefresh();
      if (res?.ok) {
        const userData = await res.json();
        setUser(userData);
        setLoading(false);
      } else {
        setUser(null);
        router.push("/login")
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
      <Header />
      aaaaaa
      <div className="ml-[6.25%]">
        <div className="w-full flex justify-center">
          <img src="./netflix.png" width={256} className=""/>
        </div>
        <ScrollToVideo />
        {/* <ScrollToVideo />
        <ScrollToVideo /> */}
      </div>
    </div>
  );
}
