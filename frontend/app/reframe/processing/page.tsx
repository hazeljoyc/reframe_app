"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./processing.css";

const PHRASES = [
  "untangling assumptions…",
  "separating facts from fears…",
  "zooming out…",
  "reframing thoughts…",
  "softening self-criticism…",
  "building clarity…",
  "shaping your next step…",
];

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intensity = Math.min(10, Math.max(1, parseInt(searchParams.get("intensity") ?? "5", 10)));
  const category = searchParams.get("category") || "life";
  const emotion = searchParams.get("emotion") ?? "2";
  const situation = searchParams.get("situation") ?? "";
  const context = searchParams.get("context") ?? "";
  const additional_context = searchParams.get("additional_context") ?? "";

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [isBackReady, setIsBackReady] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  const isHighIntensity = intensity >= 7;
  const isLowIntensity = intensity <= 3;

  const microcopy = isHighIntensity
    ? "Take a breath. We're working gently."
    : isLowIntensity
      ? "Building from steady ground."
      : "Clarity is forming.";

  useEffect(() => {
    const readyId = setTimeout(() => setIsBackReady(true), 1000);
    return () => clearTimeout(readyId);
  }, []);

  useEffect(() => {
    let navId: ReturnType<typeof setTimeout> | undefined;
    const resultsId = setTimeout(() => {
      setIsTransitioningOut(true);
      navId = setTimeout(() => {
        router.push(`/reframe/results?category=${category}&emotion=${emotion}&intensity=${intensity}&situation=${encodeURIComponent(situation)}&context=${encodeURIComponent(context)}&additional_context=${encodeURIComponent(additional_context)}`);
      }, 800);
    }, 6000);
    return () => {
      clearTimeout(resultsId);
      if (navId) clearTimeout(navId);
    };
  }, [router, category, emotion, intensity]);

  useEffect(() => {
    setPhraseVisible(true);
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setPhraseVisible(false);
      timeoutId = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhraseVisible(true));
        });
      }, 900);
    }, 2800);
    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`processing-screen ${isTransitioningOut ? "processing-transition-out" : ""}`}>
      <div className="processing-bg" aria-hidden />
      <div className="processing-overlay" aria-hidden />
      <div
        className="processing-orb"
        data-intensity={intensity}
        aria-hidden
      />

      <header className="processing-header-nav">
        <Link
          href={`/reframe?category=${category}`}
          className={`processing-back ${isBackReady ? "processing-back-ready" : ""}`}
          aria-label="Back to emotional input"
        >
          ← Back
        </Link>
      </header>

      <main className={`processing-main ${isTransitioningOut ? "processing-main-fade-out" : ""}`}>
        <div className="processing-header">
          <p className="processing-step">STEP 3 OF 3</p>
          <h1 className="processing-title">Reframing your situation…</h1>
        </div>

        <div className="processing-phrase-slot">
          <p
            className={`processing-phrase ${phraseVisible ? "processing-phrase-visible" : ""}`}
            key={phraseIndex}
            aria-live="polite"
          >
            {PHRASES[phraseIndex]}
          </p>
        </div>

        <p className="processing-microcopy">{microcopy}</p>
      </main>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="processing-screen" style={{ minHeight: "100vh" }} />
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
