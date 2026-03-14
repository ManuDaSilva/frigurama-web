"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { id: string; url: string };

type Props = {
  images: GalleryImage[];
  coverUrl: string | null;
  title: string;
};

export default function ListingGallery({ images, coverUrl, title }: Props) {
  if (images.length === 0) return null;

  const initialUrl =
    coverUrl && images.some((img) => img.url === coverUrl)
      ? coverUrl
      : images[0].url;

  const [selectedUrl, setSelectedUrl] = useState(initialUrl);

  const altMain = title ? `${title} — foto principal` : "Foto del inmueble";

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100">
        <Image
          src={selectedUrl}
          alt={altMain}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
      </div>

      {/* Thumbnails — scrollable row on mobile */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => {
            const isActive = img.url === selectedUrl;
            const altThumb = title
              ? `${title} — foto ${i + 1} de ${images.length}`
              : `Foto ${i + 1} de ${images.length}`;

            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedUrl(img.url)}
                className={`relative flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                  isActive
                    ? "border-black"
                    : "border-transparent hover:border-gray-400"
                }`}
                aria-label={altThumb}
                aria-pressed={isActive}
              >
                <Image
                  src={img.url}
                  alt={altThumb}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
