import Link from "next/link";
import React from "react";

const Header = () => {
  const LogOutEvent = async () => {
    await fetch("http://127.0.0.1:8000/auth/logout", {
      method: "POST",
      credentials: "include", // ← cookie を送る
    });
    localStorage.clear();
  };

  return (
    <div className="fixed w-1/15 h-screen border-r border-amber-50 bg-black text-white">
      <div className="h-1/4"></div>
      <div className="h-1/2 flex flex-col justify-center items-center text-xl gap-6">
        <Link href="/home">
          <div className="hover:text-2xl">ホーム</div>
        </Link>
        <Link href="/home">
          <div className="hover:text-2xl">探す</div>
        </Link>
        <Link href="/register_video">
          <div className="hover:text-2xl">追加</div>
        </Link>
      </div>
      <div className="h-1/4 flex flex-col justify-center items-center text-[12px]">
        <Link href="/login">
          <button
            onClick={LogOutEvent}
            className="hover:text-[16px] cursor-pointer"
          >
            <div>ログアウト</div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
