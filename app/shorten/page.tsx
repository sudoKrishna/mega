"use client";

import React, { useState } from "react";

const Page = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl: url }),
    });

    const data = await res.json();
    setShortUrl(data.shortUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ede4ce] text-black">
      <div className="w-full max-w-md border border-black p-6">
        
        <h1 className="text-xl font-semibold mb-6">
          URL Shortener
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border border-black px-3 py-2 outline-none"
          />

          <button
            onClick={handleShorten}
            className="border border-black px-4 py-2 hover:bg-black hover:text-white transition"
          >
            Shorten
          </button>
        </div>

        {shortUrl && (
          <div className="mt-6 border-t border-black pt-4">
            <p className="text-sm mb-1">Short URL</p>
            <a
              href={shortUrl}
              target="_blank"
              className="underline break-all"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;