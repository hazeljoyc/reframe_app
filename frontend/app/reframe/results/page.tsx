"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "./results.css";

type Mode = "week" | "month";

const ACTIONS_WEEK = [
  "Refine positioning",
  "Reach out to 1 person",
  "Submit 2 applications",
];

const ACTIONS_MONTH = [
  "Clarify direction",
  "Build outreach rhythm",
  "Secure interviews",
  "Reflect + recalibrate",
];

const TIMELINE_NODES_WEEK = [
  { left: "18%", top: "48%", title: "Refine positioning", desc: "Polish your narrative" },
  { left: "50%", top: "48%", title: "Reach out to 1 person", desc: "One meaningful connection" },
  { left: "82%", top: "48%", title: "Submit 2 applications", desc: "Targeted, intentional" },
];

const TIMELINE_NODES_MONTH = [
  { left: "12%", top: "48%", title: "Clarify direction", desc: "Define your focus" },
  { left: "36%", top: "48%", title: "Build outreach rhythm", desc: "Consistent momentum" },
  { left: "62%", top: "48%", title: "Secure interviews", desc: "Land conversations" },
  { left: "88%", top: "48%", title: "Reflect + recalibrate", desc: "Review and adjust" },
];

const MEANING_ITEMS = [
  { label: "Unclear benchmarks", text: "It's hard to know what \"on track\" looks like when you're charting your own path." },
  { label: "Comparison bias", text: "We compare our behind-the-scenes to everyone else's highlight reel." },
  { label: "Lack of roadmap", text: "Without a clear next step, it's easy to feel stuck even when you're moving." },
];

function ResultsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "life";
  const emotion = searchParams.get("emotion") ?? "";
  const intensity = searchParams.get("intensity") ?? "";
  const [mode, setMode] = useState<Mode>("week");
  const [activatedIndex, setActivatedIndex] = useState<number | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const timelineRef = useRef<HTMLElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  const actions = mode === "week" ? ACTIONS_WEEK : ACTIONS_MONTH;
  const timelineNodesBase = mode === "week" ? TIMELINE_NODES_WEEK : TIMELINE_NODES_MONTH;
  const positions = mode === "week" ? ["18%", "50%", "82%"] : ["12%", "36%", "62%", "88%"];
  const orderedNodes =
    activatedIndex !== null && activatedIndex < timelineNodesBase.length
      ? [
          timelineNodesBase[activatedIndex],
          ...timelineNodesBase.filter((_, i) => i !== activatedIndex),
        ]
      : timelineNodesBase;
  const timelineNodes = orderedNodes.map((node, i) => ({ ...node, left: positions[i], top: "48%" }));
  const activatedAction = activatedIndex !== null && activatedIndex < actions.length ? actions[activatedIndex] : undefined;

  useEffect(() => {
    const els = document.querySelectorAll(".results-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains("results-reveal-visible")) {
            entry.target.classList.add("results-reveal-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimelineVisible(true);
      },
      { threshold: 0.2 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const handleActivate = (index: number) => {
    setActivatedIndex((prev) => (prev === index ? null : index));
  };

  const handleSave = async () => {
    if (isSaving || savedSessionId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          emotion,
          intensity,
          mode,
          activatedAction,
          aiResponse: "You're not behind. You're in a transition phase — and that's exactly when clarity matters most.",
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSavedSessionId(data.sessionId);
    } catch {
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  const linkUrl = savedSessionId ? (typeof window !== "undefined" ? `${window.location.origin}/s/${savedSessionId}` : `/s/${savedSessionId}`) : "";

  const handleCopy = async () => {
    if (!linkUrl) return;
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty("--results-scroll-y", `${y}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="results-screen">
      <div className="results-bg-wrap">
        <div className="results-bg" aria-hidden />
      </div>
      <div className="results-overlay" aria-hidden />

      <header className="results-header">
        <Link
          href={`/reframe/processing?category=${category}${emotion ? `&emotion=${emotion}` : ""}${intensity ? `&intensity=${intensity}` : ""}`}
          className="results-back"
          aria-label="Back to processing"
        >
          ← Back
        </Link>
      </header>

      <main className="results-main">
        {/* Section 1 — Emotional Reframe */}
        <section className="results-hero-section results-reveal">
          <h1 className="results-hero-title">Your next steps in motion.</h1>
          <p className="results-hero-subtitle">Clarity becomes momentum.</p>
          <div className="results-reframe-card-wrap">
            <div className="results-card results-reframe-card">
              <p className="results-reframe-text">
                You&apos;re not behind. You&apos;re in a transition phase — and that&apos;s exactly when clarity matters most.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — What This Actually Means */}
        <section className="results-section results-reveal">
          <h2 className="results-section-title">What this actually means</h2>
          <div className="results-card results-meaning-card">
            <ul className="results-meaning-list">
              {MEANING_ITEMS.map((item, i) => (
                <li key={i} className="results-meaning-bullet" style={{ animationDelay: `${150 * i}ms` }}>
                  <span className="results-meaning-label">{item.label}</span> — {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3 — Start with one (action cards) */}
        <section className="results-section results-reveal">
          <h2 className="results-section-title">Start with one.</h2>
          <p className="results-start-micro">You don&apos;t need to do everything. Just begin here.</p>
          <div className="results-action-cards">
            {actions.map((label, i) => {
              const isSelected = activatedIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  className={`results-action-card ${isSelected ? "results-action-card-selected" : ""} ${activatedIndex !== null && !isSelected ? "results-action-card-dimmed" : ""}`}
                  onClick={() => handleActivate(i)}
                >
                  <span className="results-action-card-label">{label}</span>
                  {isSelected && (
                    <span className="results-action-starting-label">✓ This is my starting point</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4 — Mode Toggle + Timeline */}
        <section ref={timelineRef} className="results-section results-timeline-section results-reveal">
          <div className="results-toggle-wrap">
            <button
              type="button"
              className={`results-toggle-btn ${mode === "week" ? "results-toggle-active" : ""}`}
              onClick={() => setMode("week")}
              aria-pressed={mode === "week"}
            >
              This Week
            </button>
            <button
              type="button"
              className={`results-toggle-btn ${mode === "month" ? "results-toggle-active" : ""}`}
              onClick={() => setMode("month")}
              aria-pressed={mode === "month"}
            >
              This Month
            </button>
          </div>

          <p className="results-timeline-hint">
            <span className="results-timeline-hint-desktop">Hover over each point to preview your next steps.</span>
            <span className="results-timeline-hint-mobile">Tap each point to preview your next steps.</span>
          </p>

          <div className={`results-timeline-outer ${mode === "month" ? "results-timeline-month" : ""}`}>
            <div className="results-timeline-inner">
              <div className="results-timeline-slot">
                <div className={`results-timeline-content ${mode === "week" ? "results-timeline-visible" : "results-timeline-hidden"}`}>
                  <div className="results-timeline-image-wrap">
                    <Image src="/timeline-week.png" alt="Timeline this week" fill className="results-timeline-image" sizes="(max-width: 768px) 100vw, 640px" />
                  </div>
                </div>
                <div className={`results-timeline-content ${mode === "month" ? "results-timeline-visible" : "results-timeline-hidden"}`}>
                  <div className="results-timeline-image-wrap">
                    <Image src="/timeline-month.png" alt="Timeline this month" fill className="results-timeline-image" sizes="(max-width: 768px) 100vw, 640px" />
                  </div>
                </div>
              </div>
              {timelineNodes.map((node, i) => (
                <div
                  key={`${mode}-${node.title}`}
                  className={`results-timeline-node ${timelineVisible ? "results-timeline-node-visible" : ""}`}
                  style={{ left: node.left, top: node.top, animationDelay: `${120 * i}ms` }}
                >
                  <span className="results-timeline-node-dot" />
                  <div className="results-timeline-tooltip">
                    <strong>{node.title}</strong>
                    <span>{node.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5 — Save Ritual */}
        <section className="results-section results-save-section results-reveal">
          <h2 className="results-section-title">Keep this clarity.</h2>
          <p className="results-save-micro">Clarity fades when we don&apos;t anchor it.</p>
          {!savedSessionId ? (
            <>
              <div className="results-save-buttons">
                <button
                  type="button"
                  className="results-btn-save"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving…" : "Save your plan"}
                </button>
                <button type="button" className="results-btn-send">
                  Send it to yourself
                </button>
              </div>
              <Link href="/" className="results-link-home">← Return home</Link>
            </>
          ) : (
            <div className="results-save-success">
              <p className="results-save-success-msg">Your clarity is saved.</p>
              <div className="results-save-link-wrap">
                <input
                  type="text"
                  readOnly
                  value={linkUrl}
                  className="results-save-link-input"
                />
                <button type="button" className="results-btn-copy" onClick={handleCopy}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
          {savedSessionId && (
            <Link href="/" className="results-link-home">← Return home</Link>
          )}
        </section>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="results-screen" style={{ minHeight: "100vh" }} />}>
      <ResultsContent />
    </Suspense>
  );
}
