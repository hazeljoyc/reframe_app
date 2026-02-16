"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "@/contexts/AudioContext";

function VolumeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function GlobalHeaderRight() {
  const pathname = usePathname();
  const { isSoundOn, toggleSound } = useAudio();

  return (
    <div className="global-header-right">
      <button
        type="button"
        onClick={toggleSound}
        className="global-audio-toggle"
        aria-label={isSoundOn ? "Mute ambient sound" : "Enable ambient sound"}
        title={isSoundOn ? "Mute" : "Sound on"}
      >
        {isSoundOn ? <VolumeOnIcon /> : <VolumeOffIcon />}
      </button>
      {pathname === "/" && (
        <Link href="/about" className="global-about-link" aria-label="About Reframe">
          About
        </Link>
      )}
    </div>
  );
}
