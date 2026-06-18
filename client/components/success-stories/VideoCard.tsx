import Image from 'next/image';

interface VideoCardProps {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

function getMuxThumbnail(videoUrl: string) {
  const match = videoUrl.match(/player\.mux\.com\/([^/?]+)/);
  return match ? `https://image.mux.com/${match[1]}/thumbnail.jpg?time=0` : undefined;
}

function getEmbedUrl(videoUrl: string, posterUrl?: string) {
  try {
    const urlObj = new URL(videoUrl);
    if (posterUrl) {
      urlObj.searchParams.set('poster', posterUrl);
    }
    return urlObj.toString();
  } catch {
    if (!posterUrl) return videoUrl;
    const separator = videoUrl.includes('?') ? '&' : '?';
    return `${videoUrl}${separator}poster=${encodeURIComponent(posterUrl)}`;
  }
}

export default function VideoCard({ title, videoUrl, thumbnailUrl }: VideoCardProps) {
  const resolvedThumbnail = thumbnailUrl ?? getMuxThumbnail(videoUrl);
  const embedUrl = getEmbedUrl(videoUrl, resolvedThumbnail);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black aspect-video w-full">
      {resolvedThumbnail && (
        <Image
          alt={title}
          className="object-cover"
          src={resolvedThumbnail}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
        />
      )}
      <iframe
        className="absolute inset-0 w-full h-full"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
