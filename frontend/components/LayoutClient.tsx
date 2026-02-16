"use client";

import { AudioProvider } from "@/contexts/AudioContext";
import { GlobalHeaderRight } from "./GlobalHeaderRight";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      {children}
      <GlobalHeaderRight />
    </AudioProvider>
  );
}
