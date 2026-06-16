'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VideoCardProps {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
}

function isLocalVideo(url: string) {
  return url.startsWith('/');
}

export default function VideoCard({ title, videoUrl, thumbnailUrl, duration }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const localVideo = isLocalVideo(videoUrl);

  const getAutoplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('autoplay', '1');
      return urlObj.toString();
    } catch {
      return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
    }
  };

  const playOverlay = (
    <>
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
          <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">play_arrow</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        {/* <p className="font-bold">{title}</p> */}
        {duration && <p className="text-xs opacity-90">Duration: {duration}</p>}
      </div>
    </>
  );

  return (
    <div className="relative rounded-2xl overflow-hidden group shadow-lg bg-black aspect-video w-full">
      {!isPlaying ? (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          {localVideo ? (
            <video
              src={videoUrl}
              preload="metadata"
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            thumbnailUrl && (
              <Image
                alt={title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                src={thumbnailUrl}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
              />
            )
          )}
          {playOverlay}
        </div>
      ) : localVideo ? (
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          title={title}
        />
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={getAutoplayUrl(videoUrl)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
