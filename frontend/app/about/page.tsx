"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./about.css";

export default function AboutPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      const y = Math.min(window.scrollY, 1200);
      document.documentElement.style.setProperty("--about-scroll-y", `${y * 0.04}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((s) => new Set([...s, i]));
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      ob.observe(el);
      observers.push(ob);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="about-screen">
      {/* Background */}
      <div className="about-bg-wrap" aria-hidden>
        <div className="about-bg" />
      </div>
      <div className="about-overlay" aria-hidden />

      {/* Parallax orbs */}
      <div className="about-orb about-orb-1" aria-hidden />
      <div className="about-orb about-orb-2" aria-hidden />
      <div className="about-orb about-orb-3" aria-hidden />

      <header className="about-header">
        <Link href="/" className="about-back" aria-label="Back to home">
          ← Back
        </Link>
      </header>

      <main className="about-main">
        {/* Section 1 — Hero */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className={`about-section about-hero ${visibleSections.has(0) ? "about-visible" : ""}`}
        >
          <h1 className="about-hero-title">Why Reframe Exists.</h1>
          <div className="about-hero-divider" />
          <p className="about-hero-sub">Because clarity shouldn&apos;t feel complicated.</p>
          <p className="about-hero-subtext">Especially for students &amp; young professionals.</p>
          <p className="about-hero-optional">Most advice skips the part that matters most — how you actually feel.</p>
          <Link href="/categories" className="about-btn-primary">Start Reframing</Link>
        </section>

        {/* Section 2 — The Problem */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className={`about-section about-problem ${visibleSections.has(1) ? "about-visible" : ""}`}
        >
          <div className="about-problem-grid">
            <h2 className="about-problem-title">We all feel stuck sometimes.</h2>
            <div className="about-glass-card about-problem-card">
              <ul className="about-problem-list">
                <li>We compare ourselves to curated highlights.</li>
                <li>We think we&apos;re behind.</li>
                <li>We feel unclear but don&apos;t know why.</li>
                <li>Advice tells us what to do — not how to think differently.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 — The Shift */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className={`about-section about-shift ${visibleSections.has(2) ? "about-visible" : ""}`}
        >
          <p className="about-shift-statement">
            Reframe doesn&apos;t give you answers.
            <br />
            It changes how you see the question.
          </p>
          <div className="about-shift-cards">
            <div className="about-glass-card about-shift-card">
              <span className="about-shift-icon" aria-hidden>🧠</span>
              <h3>Emotion-first input</h3>
              <p>We start with how you feel.</p>
            </div>
            <div className="about-glass-card about-shift-card">
              <span className="about-shift-icon" aria-hidden>🔍</span>
              <h3>Meaning decoding</h3>
              <p>We unpack what that feeling really means.</p>
            </div>
            <div className="about-glass-card about-shift-card">
              <span className="about-shift-icon" aria-hidden>🚀</span>
              <h3>Action in motion</h3>
              <p>We translate clarity into next steps.</p>
            </div>
          </div>
        </section>

        {/* Section 4 — Everyone Has Issues */}
        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          className={`about-section about-issues ${visibleSections.has(3) ? "about-visible" : ""}`}
        >
          <h2 className="about-issues-title">Everyone has issues.</h2>
          <p className="about-issues-sub">Uncertainty. Comparison. Pressure. Doubt.</p>
          <p className="about-issues-punch">
            Having a plan doesn&apos;t solve everything —
            <br />
            but it gives your momentum direction.
          </p>
          <p className="about-issues-closer">When clarity turns into a plan, transition turns into movement.</p>
        </section>

        {/* Section 5 — What Makes It Different */}
        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          className={`about-section about-different ${visibleSections.has(4) ? "about-visible" : ""}`}
        >
          <div className="about-different-cards">
            <div className="about-glass-card about-diff-card">
              <h3>Emotion-aware AI</h3>
              <p>&quot;Your emotional state shapes how we guide you.&quot;</p>
            </div>
            <div className="about-glass-card about-diff-card">
              <h3>Adaptive questions</h3>
              <p>&quot;Your answers influence what comes next.&quot;</p>
            </div>
            <div className="about-glass-card about-diff-card">
              <h3>Momentum timeline</h3>
              <p>&quot;Clarity becomes visible forward motion.&quot;</p>
            </div>
          </div>
        </section>

        {/* Section 6 — Final CTA */}
        <section
          ref={(el) => { sectionRefs.current[5] = el; }}
          className={`about-section about-cta ${visibleSections.has(5) ? "about-visible" : ""}`}
        >
          <h2 className="about-cta-title">Ready to see it differently?</h2>
          <div className="about-cta-buttons">
            <Link href="/categories" className="about-btn-primary">Start Reframing</Link>
            <Link href="/" className="about-btn-secondary">Return Home</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
