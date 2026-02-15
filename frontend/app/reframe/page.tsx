"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./reframe.css";

const EMOJIS = ["😌", "🙂", "😐", "😕", "😞", "😢", "😭"];
const EMOTION_LABELS = ["Feeling calm.", "Feeling hopeful.", "Feeling neutral.", "Feeling uncertain.", "Feeling discouraged.", "Feeling overwhelmed.", "Feeling deeply frustrated."];
const EMOTION_SUPPORT = [
  "Let's build from a steady place.",
  "There's something to work with here.",
  "Clarity often starts here.",
  "That's okay. Let's unpack it.",
  "That sounds heavy.",
  "Let's slow this down together.",
  "You don't have to carry this alone.",
];

function ReframeContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [context, setContext] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isContinueEnabled = selectedEmoji !== null;
  const continueHref = isContinueEnabled
    ? `/reframe/next?category=${category}&emotion=${selectedEmoji}&context=${encodeURIComponent(context)}`
    : "#";

  return (
    <div className="reframe-screen">
      <div className="reframe-bg" aria-hidden />
      <div className="reframe-overlay" aria-hidden />

      <header className="reframe-header">
        <Link href="/categories" className="reframe-back" aria-label="Back">
          ← Back
        </Link>
      </header>

      <section className="reframe-section">
        <div className="reframe-title-block reveal">
          <p className="step-label">STEP 2 OF 3</p>
          <div className="step-progress">
            <div className="step-progress-fill step-progress-66" aria-hidden />
          </div>
          <h1 className="reframe-title">How are you feeling about this?</h1>
        </div>

        <div className="emoji-slider-wrap reveal" style={{ transitionDelay: "0.25s" }}>
          <div className="emoji-track">
            <span className="emoji-track-line" aria-hidden />
            {EMOJIS.map((emoji, i) => (
              <button
                key={i}
                type="button"
                className={`emoji-option ${selectedEmoji === i ? "emoji-selected" : ""}`}
                onClick={() => setSelectedEmoji(i)}
                aria-label={`Select ${["calm", "happy", "neutral", "uneasy", "sad", "tearful", "crying"][i]}`}
                aria-pressed={selectedEmoji === i}
              >
                <span className="emoji-char">{emoji}</span>
                {selectedEmoji === i && <span className="emoji-indicator" aria-hidden />}
              </button>
            ))}
          </div>
          {isContinueEnabled && (
            <div className="reframe-emotion-labels">
              <p className="reframe-emotion-label">{EMOTION_LABELS[selectedEmoji]}</p>
              <p className="reframe-emotion-support">{EMOTION_SUPPORT[selectedEmoji]}</p>
            </div>
          )}
        </div>

        <div className="reframe-input-wrap reveal" style={{ transitionDelay: "0.4s" }}>
          <input
            type="text"
            className="reframe-input"
            placeholder="Want to add context?"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <div className="reframe-cta-wrap reveal" style={{ transitionDelay: "0.5s" }}>
          <Link
            href={continueHref}
            className={`reframe-continue ${isContinueEnabled ? "reframe-continue-active" : "reframe-continue-inactive"}`}
            aria-disabled={!isContinueEnabled}
            onClick={(e) => !isContinueEnabled && e.preventDefault()}
          >
            Continue
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ReframePage() {
  return (
    <Suspense fallback={<div className="reframe-screen" style={{ minHeight: "100vh" }} />}>
      <ReframeContent />
    </Suspense>
  );
}
