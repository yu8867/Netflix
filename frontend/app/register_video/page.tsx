"use client";
import React, { useState } from 'react'

const page = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  return (
    <div className="text-white">
      <h1>映画の追加</h1>
      <form>
        <div>
          <input type="text" value={title} onChange={(e) => setEmail(e.target.value)}>aaaa</input>
        </div>
        <div>
          <input type="text" value={description} onChange={(e) => setEmail(e.target.value)}>aaaa</input>
          </div>
        <div><input type="text" value={thumbnail} onChange={(e) => setEmail(e.target.value)}>aaaa</input></div>
        <div><input type="text" value={url} onChange={(e) => setEmail(e.target.value)}>aaaa</input></div>
      </form>
    </div>
  )
}

export default page