import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="fixed w-1/15 h-screen border-r border-amber-50 bg-black text-white">
      <div className="h-1/4"></div>
      <div className="h-1/2 flex flex-col justify-center items-center text-2xl gap-6">
        <Link href="/home">
          <div className="hover:text-4xl">Home</div>
        </Link>
        <Link href="/home">
          <div className="hover:text-4xl">Search</div>
        </Link>
        <Link href="/register_video">
          <div className="hover:text-4xl">Add</div>
        </Link>
      </div>
      <div className="h-1/4 flex flex-col justify-center items-center text-xl">
        <Link href="/home">
          <div>Setting</div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
