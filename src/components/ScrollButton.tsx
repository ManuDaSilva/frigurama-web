"use client";

export default function ScrollButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      className="mt-12 border border-black px-8 py-2 rounded-full tracking-[0.3em] text-xs uppercase hover:bg-black hover:text-white transition animate-pulse"
    >
      SCROLL
    </button>
  );
}
