"use client";

import { useEffect, useRef } from "react";

type Props = {
  onUploaded: (url: string) => void;
  text?: string;
};

declare global {
  interface Window {
    cloudinary?: any;
  }
}

export default function ImageUploader({ onUploaded, text = "Subir imágenes" }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!window.cloudinary) {
      console.warn("❌ Cloudinary script no cargado.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: "listings",
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 20,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUploaded(result.info.secure_url);
        }
      }
    );

    const button = buttonRef.current;
    const open = () => widget.open();

    button?.addEventListener("click", open);

    return () => {
      button?.removeEventListener("click", open);
    };
  }, [onUploaded]);

  return (
    <button
      type="button"
      ref={buttonRef}
      className="px-3 py-2 rounded border hover:bg-gray-100"
    >
      {text}
    </button>
  );
}
