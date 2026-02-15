"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import "./home.css";

const ORBS = [
  { id: "school", label: "School", descriptor: "Finding clarity in your academic path.", href: "/decode?category=school", pos: "tl", color: "59789F" },
  { id: "internships", label: "Internships", descriptor: "Breaking into your next opportunity.", href: "/decode?category=internships", pos: "tr", color: "7A9445" },
  { id: "career", label: "Career", descriptor: "Repositioning where you're headed.", href: "/decode?category=career", pos: "bl", color: "A9B6C4" },
  { id: "life", label: "Life/Adulting", descriptor: "Balancing growth with real life.", href: "/decode?category=life", pos: "br", color: "ECE69D" },
];

export default function Home() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [orbDimmed, setOrbDimmed] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((s) => new Set([...s, i]));
            if (i === 0) setOrbDimmed(true);
          } else if (i === 0) {
            setOrbDimmed(false);
          }
        },
        { threshold: 0.15, rootMargin: "0px" }
      );
      ob.observe(el);
      observers.push(ob);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const bg = document.querySelector(".background-layer");
      if (bg instanceof HTMLElement) {
        bg.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = screenRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: x * 5, y: y * 5 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  return (
    <div ref={screenRef} className="home-screen" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Background layer */}
      <div className="background-layer" aria-hidden />

      <svg className="home-grain" aria-hidden>
        <filter id="home-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#home-grain)" />
      </svg>

      {/* 4 floating orbs */}
      <div className={`home-orb-container ${orbDimmed ? "home-orb-container-dimmed" : ""}`}>
      {ORBS.map((orb) => (
        <div key={orb.id} className={`home-orb-wrap home-orb-${orb.pos}`}>
          <div
            className="home-orb-parallax"
            style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
          >
            <Link href={orb.href} className="home-orb" data-color={orb.color}>
              <span className="home-orb-title">{orb.label}</span>
              <span className="home-orb-desc">{orb.descriptor}</span>
            </Link>
          </div>
        </div>
      ))}
      </div>

      <header className="home-header">
        <Link href="/" className="home-logo" aria-label="Reframe">
          <span className="home-logo-img" />
        </Link>
        <Link href="/about" className="home-about-btn" aria-label="About Reframe">
          About
        </Link>
      </header>

      <div className="home-center">
        <div className="home-content-block">
          <div className="headline-wrapper">
          <p className="home-headline">
            what part of
            <br />
            your <em>work</em> life
            <br />
            do <em>you</em> want
            <br />
            to change?
          </p>
          </div>
          <Link href="/categories" className="home-cta">
            Start Reframing
          </Link>
        </div>
      </div>

      {/* Section 2 — Meaning */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className={`section section-meaning home-section home-section-meaning ${visibleSections.has(0) ? "home-section-visible" : ""}`}
      >
        <div className="section-content home-section-inner">
          <h2 className="reveal" style={{ transitionDelay: "0.2s" }}>Change the story you&apos;re telling yourself.</h2>
          <p className="reveal" style={{ transitionDelay: "0.4s" }}>
            Reframe is a guided space to slow down, unpack what feels stuck,
            and gently shift the way you see your situation.
            Sometimes clarity doesn&apos;t come from changing your job —
            it comes from changing your perspective.
          </p>
        </div>
      </section>

      {/* Section 3 — How It Works */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className={`section section-how home-section home-section-how ${visibleSections.has(1) ? "home-section-visible" : ""}`}
      >
        <div className="section-content home-section-inner">
          <p className="section-label reveal" style={{ transitionDelay: "0.2s" }}>HOW IT WORKS</p>

          <div className="step reveal" style={{ transitionDelay: "0.3s" }}>
            <h3>Choose what feels stuck.</h3>
            <p>Select the part of your work life that feels heavy or unclear.</p>
          </div>

          <div className="step reveal" style={{ transitionDelay: "0.5s" }}>
            <h3>Reflect through guided prompts.</h3>
            <p>We&apos;ll help you unpack assumptions, fears, and expectations.</p>
          </div>

          <div className="step reveal" style={{ transitionDelay: "0.7s" }}>
            <h3>Leave with a new perspective.</h3>
            <p>Walk away with clarity, direction, or simply a lighter mindset.</p>
          </div>
        </div>
      </section>

      {/* Section 4 — Final Call */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`section section-final home-section home-section-final ${visibleSections.has(2) ? "home-section-visible" : ""}`}
      >
        <div className="section-content home-section-inner home-section-final-inner">
          <h2 className="reveal" style={{ transitionDelay: "0.2s" }}>Ready to see it differently?</h2>
          <p className="reveal" style={{ transitionDelay: "0.4s" }}>It only takes a few minutes to shift your perspective.</p>
          <Link href="/categories" className="home-cta reveal cta-no-hover-delay" style={{ transitionDelay: "0.6s" }}>
            Start Reframing
          </Link>
        </div>
      </section>
    </div>
  );
}
