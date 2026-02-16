"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "./results.css";

type Mode = "week" | "month";

// Types for API response
type ActionItem = { title: string; description: string };
type TimelineAction = { title: string; description: string };
type TimelineItem = { week: TimelineAction[]; month: TimelineAction[] };

type ApiResponse = {
  planId: string;
  reframe: string;
  analysis: string[];
  actions: ActionItem[];
  timeline: TimelineItem[];
};

// Fallback data (used when API fails)
const FALLBACK_ANALYSIS = [
  "Unclear benchmarks - It's hard to know what \"on track\" looks like when you're charting your own path.",
  "Comparison bias - We compare our behind-the-scenes to everyone else's highlight reel.",
  "Lack of roadmap - Without a clear next step, it's easy to feel stuck even when you're moving.",
];

const FALLBACK_ACTIONS: ActionItem[] = [
  { title: "Refine positioning", description: "Polish your narrative" },
  { title: "Reach out to 1 person", description: "One meaningful connection" },
  { title: "Submit 2 applications", description: "Targeted, intentional" },
];

const FALLBACK_TIMELINE: TimelineItem = {
  week: [
    { title: "Refine positioning", description: "Polish your narrative" },
    { title: "Reach out to 1 person", description: "One meaningful connection" },
    { title: "Submit 2 applications", description: "Targeted, intentional" },
  ],
  month: [
    { title: "Clarify direction", description: "Define your focus" },
    { title: "Build outreach rhythm", description: "Consistent momentum" },
    { title: "Secure interviews", description: "Land conversations" },
  ],
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "life";
  const emotion = searchParams.get("emotion") ?? "";
  const intensity = searchParams.get("intensity") ?? "";
  const situation = searchParams.get("situation") ?? "";
  const context = searchParams.get("context") ?? "";
  const additional_context = searchParams.get("additional_context") ?? "";

  const [mode, setMode] = useState<Mode>("week");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activatedIndex, setActivatedIndex] = useState<number | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const timelineRef = useRef<HTMLElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  // Get data from API or use fallbacks
  const reframe = apiData?.reframe || "You're not behind. You're in a transition phase — and that's exactly when clarity matters most.";
  const analysis = apiData?.analysis || FALLBACK_ANALYSIS;
  const actions = apiData?.actions || FALLBACK_ACTIONS;
  const timelineData = apiData?.timeline?.[0] || FALLBACK_TIMELINE;

  // Get timeline items based on mode
  const timelineItems = mode === "week" ? timelineData.week : timelineData.month;
  const positions = mode === "week" ? ["18%", "50%", "82%"] : ["12%", "36%", "62%", "88%"];

  // Build timeline nodes with positions
  const timelineNodesBase = timelineItems.map((item, i) => ({
    left: positions[i] || "50%",
    top: "48%",
    title: item.title,
    desc: item.description,
  }));

  const orderedNodes =
    activatedIndex !== null && activatedIndex < timelineNodesBase.length
      ? [
          timelineNodesBase[activatedIndex],
          ...timelineNodesBase.filter((_, i) => i !== activatedIndex),
        ]
      : timelineNodesBase;
  const timelineNodes = orderedNodes.map((node, i) => ({ ...node, left: positions[i] || "50%", top: "48%" }));
  const activatedAction = activatedIndex !== null && activatedIndex < actions.length ? actions[activatedIndex]?.title : undefined;

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

  useEffect(() => {
    const cards = document.querySelectorAll(".results-reframe-card, .results-meaning-card-mini");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains("results-accent-active")) {
            entry.target.classList.add("results-accent-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px" }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
          aiResponse: reframe,
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

  // Fetch AI response from backend (only once)
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAiResponse = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${backendUrl}/generate-path`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            emotion: parseInt(emotion, 10) || 0,
            situation: situation || "Feeling uncertain",
            intensity: parseInt(intensity, 10) || 5,
            context: context || "",
            additional_context: additional_context || "",
          }),
        });
        if (!res.ok) {
          throw new Error(`Backend error: ${res.status}`);
        }
        const data = await res.json();
        if (data.reframe) {
          setApiData(data as ApiResponse);
        } else if (data.error) {
          throw new Error(data.message || "API returned error");
        } else {
          setApiError("No reframe generated.");
        }
      } catch (err) {
        console.error("Failed to fetch AI response:", err);
        setApiError("Failed to connect to backend. Using fallback response.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAiResponse();
  }, [category, emotion, situation, intensity, context, additional_context]);

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
          <p className="results-hero-subtitle">
            Clarity becomes <span className="results-momentum-underline">momentum</span>.
          </p>
          <div className="results-reframe-card-wrap">
            <span className="results-ai-insight-label">AI Insight</span>
            <div className="results-card results-reframe-card">
              <div className="results-accent-line" aria-hidden>
                <div className="results-accent-line-fill" />
              </div>
              <div className="results-reframe-card-content">
                {isLoading ? (
                  <p className="results-reframe-text">Generating your personalized insight...</p>
                ) : (
                  <p className="results-reframe-text">{reframe}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — What This Actually Means */}
        <section className="results-section results-meaning-section results-reveal">
          <h2 className="results-section-title">What this actually means</h2>
          <div className="results-meaning-cards">
            {isLoading ? (
              <p>Loading insights...</p>
            ) : (
              analysis.map((insight, i) => (
                <div
                  key={i}
                  className="results-meaning-card-mini"
                  style={{ animationDelay: `${80 * i}ms` }}
                >
                  <div className="results-accent-line" aria-hidden>
                    <div className="results-accent-line-fill" />
                  </div>
                  <div className="results-meaning-card-content">
                    <h3 className="results-meaning-card-title">Insight {i + 1}</h3>
                    <p className="results-meaning-card-text">{insight}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 3 — Start with one (action cards) */}
        <section className="results-section results-reveal">
          <h2 className="results-section-title">Start with one.</h2>
          <p className="results-start-micro">You don&apos;t need to do everything. Just begin here.</p>
          <div className="results-action-cards">
            {isLoading ? (
              <p>Loading actions...</p>
            ) : (
              actions.map((action, i) => {
                const isSelected = activatedIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`results-action-card ${isSelected ? "results-action-card-selected" : ""} ${activatedIndex !== null && !isSelected ? "results-action-card-dimmed" : ""}`}
                    onClick={() => handleActivate(i)}
                    title={action.description}
                  >
                    <span className="results-action-card-label">{action.title}</span>
                    {isSelected && (
                      <span className="results-action-starting-label">✓ This is my starting point</span>
                    )}
                  </button>
                );
              })
            )}
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
