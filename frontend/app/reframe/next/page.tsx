"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getReflectionOptions, SOMETHING_ELSE_VALUE } from "./reflectionOptions";
import "./next.css";

function ReframeNextContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "life";
  const emotionIndex = parseInt(searchParams.get("emotion") ?? "2", 10);
  const contextFromStep2 = searchParams.get("context") ?? "";

  const options = getReflectionOptions(category, emotionIndex);

  const [primaryReflection, setPrimaryReflection] = useState<string | null>(null);
  const [somethingElseText, setSomethingElseText] = useState("");
  const [intensityLevel, setIntensityLevel] = useState<number | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");

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

  const isSomethingElse = primaryReflection === SOMETHING_ELSE_VALUE;
  const effectiveReflection = isSomethingElse ? somethingElseText : primaryReflection;
  const isQ1Complete = primaryReflection !== null && (isSomethingElse ? somethingElseText.trim() !== "" : true);
  const showQ2 = primaryReflection !== null;
  const showQ3 = intensityLevel !== null;

  const handleSelectOption = (opt: string) => {
    setPrimaryReflection(opt);
    if (opt !== SOMETHING_ELSE_VALUE) {
      setSomethingElseText("");
    }
  };

  const processingHref = isQ1Complete
    ? `/reframe/processing?category=${category}&emotion=${emotionIndex}&intensity=${intensityLevel ?? 5}&situation=${encodeURIComponent(effectiveReflection || "")}&context=${encodeURIComponent(contextFromStep2)}&additional_context=${encodeURIComponent(additionalContext)}`
    : "#";

  return (
    <div className="reframe-next-screen">
      <div className="reframe-next-bg" aria-hidden />
      <div className="reframe-next-overlay" aria-hidden />

      <header className="reframe-next-header">
        <Link href={`/reframe?category=${category}`} className="reframe-next-back" aria-label="Back">
          ← Back
        </Link>
      </header>

      <section className="reframe-next-section">
        <div className="reframe-next-title-block reveal">
          <p className="step-label">STEP 3 OF 3</p>
          <div className="step-progress">
            <div className="step-progress-fill step-progress-100" aria-hidden />
          </div>
          <h1 className="reframe-next-title">Let&apos;s unpack this.</h1>
          <p className="reframe-next-subtext">
            A few guided prompts to help shift your perspective.
          </p>
        </div>

        <div className="reframe-next-content">
          {/* Q1 — Selectable reflection */}
          <div className="reframe-next-q1 reveal" style={{ transitionDelay: "0.2s" }}>
            <h2 className="reframe-next-question">What feels most true right now?</h2>
            <div className="reframe-next-pills">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`reframe-next-pill ${primaryReflection === opt ? "reframe-next-pill-selected" : ""}`}
                  onClick={() => handleSelectOption(opt)}
                  aria-pressed={primaryReflection === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
            {isSomethingElse && (
              <div className="reframe-next-something-else-wrap">
                <input
                  type="text"
                  className="reframe-next-something-else-input"
                  placeholder="Tell us in your own words…"
                  value={somethingElseText}
                  onChange={(e) => setSomethingElseText(e.target.value)}
                  autoFocus
                  aria-label="Something else"
                />
              </div>
            )}
          </div>

          {/* Q2 — Intensity slider (reveals after Q1) */}
          {showQ2 && (
            <div className="reframe-next-q2 reframe-next-reveal-item">
              <h2 className="reframe-next-question">How intense does this feel right now?</h2>
              <div className="reframe-next-slider-wrap">
                <span className="reframe-next-slider-value" aria-live="polite">
                  {intensityLevel ?? 5}
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensityLevel ?? 5}
                  onChange={(e) => setIntensityLevel(parseInt(e.target.value, 10))}
                  className="reframe-next-slider"
                  aria-label="Intensity level 1 to 10"
                />
              </div>
            </div>
          )}

          {/* Q3 — Optional context (reveals after slider interaction) */}
          {showQ3 && (
            <div className="reframe-next-q3 reframe-next-reveal-item">
              <label htmlFor="reframe-additional" className="reframe-next-label">
                Anything else we should know?
              </label>
              <textarea
                id="reframe-additional"
                className="reframe-next-textarea-mini"
                placeholder="Optional — just a sentence or two."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={2}
                aria-label="Optional additional context"
              />
            </div>
          )}

          {/* See My Reframe — always visible, disabled until Q1 */}
          <div className="reframe-next-cta-wrap">
            <Link
              href={processingHref}
              className={`reframe-next-btn reframe-next-btn-primary ${isQ1Complete ? "reframe-next-btn-enabled" : "reframe-next-btn-disabled"}`}
              aria-disabled={!isQ1Complete}
              onClick={(e) => !isQ1Complete && e.preventDefault()}
            >
              See My Reframe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ReframeNextPage() {
  return (
    <Suspense
      fallback={
        <div className="reframe-next-screen" style={{ minHeight: "100vh" }} />
      }
    >
      <ReframeNextContent />
    </Suspense>
  );
}
