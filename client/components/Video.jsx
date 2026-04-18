"use client";

import Player from "next-video/player";

export default function Video({ video, poster, blurDataURL }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <Player
        className={`w-full h-full`}
        poster={poster}
        src={video}
        blurDataURL={blurDataURL}
      />
    </div>
  );
}
